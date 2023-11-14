import { DataConnection, Peer } from "peerjs";
import { useEffect, useState } from "react";

export function PeerWebRtc() {
  const [myId, setMyId] = useState<string | undefined>();
  const [peer, setPeer] = useState<Peer | undefined>();
  const [targetId, setTargetId] = useState<string | undefined>();
  const [conn, setConn] = useState<DataConnection | undefined>();

  const connect = () => {
    if (!targetId || !peer) return;
    setConn(peer.connect(targetId));
  };

  const sendMessage = () => {
    if (!conn) return;
    conn.send("hello!");
  };

  useEffect(() => {
    if (!myId) return;
    setPeer(new Peer(myId));
  }, [myId]);
  useEffect(() => {
    if (!conn || !peer) return;
    conn.on("open", () => {
      conn.send("hi!");
    });

    peer.on("connection", (conn) => {
      conn.on("data", (data) => {
        // Will print 'hi!'
        window.alert(data);
      });
      conn.on("open", () => {
        conn.send("hello!");
      });
    });
  }, [peer, conn]);

  return (
    <div>
      PEER JS CONNECTED
      <input
        type="text"
        value={myId}
        onChange={(e) => setMyId(e.currentTarget.value)}
      />
      <div>My Id: {myId}</div>
      <input
        type="text"
        value={targetId}
        onChange={(e) => setTargetId(e.currentTarget.value)}
      />
      <button onClick={connect}>Connect</button>
      <button onClick={sendMessage}>Send PEER meessage</button>
    </div>
  );
}
