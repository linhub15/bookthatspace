import { DataConnection, Peer } from "peerjs";
import { useEffect, useState } from "react";
import { Video } from "./components/video";

export function PeerWebRtc2() {
  const [id, setId] = useState<string | undefined>();
  const [peer, setPeer] = useState<Peer | undefined>();
  const [targetId, setTargetId] = useState<string | undefined>();
  const [connection, setConnection] = useState<DataConnection | undefined>();
  const [stream, setStream] = useState<MediaStream | undefined>();
  const [targetStream, setTargetStream] = useState<MediaStream | undefined>();

  const connect = () => {
    if (!peer || !targetId) return;
    const conn = peer?.connect(targetId);
    setConnection(conn);
  };

  const message = () => {
    if (!connection) return;
    connection.send("My custom message");
  };

  const call = () => {
    if (!peer || !stream || !targetId) return;
    peer.call(targetId, stream);
  };

  useEffect(() => {
    const peer = new Peer();
    peer.on("open", function (id) {
      console.log("My peer ID is: " + id);
      setId(id);
    });

    peer.on("connection", (conn: DataConnection) => {
      alert("someone connected");
      setConnection(conn);
    });

    peer.on("call", (call) => {
      call.answer(stream);
      setTargetStream(call.remoteStream);
    });
    setPeer(peer);
  }, [stream]);

  useEffect(() => {
    if (!connection) return;
    connection.on("open", () => {
      console.log("connection opened");
    });

    connection.on("data", (data) => {
      console.log(data);
    });
  }, [connection]);

  useEffect(() => {
    async function getMedia(constraints: MediaStreamConstraints) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(stream);
      } catch (err) {
      }
    }
    getMedia({ video: { facingMode: "user" } });
  }, []);

  return (
    <div>
      PEER JS CONNECTED
      <div>My Id: {id}</div>

      <div>
        <label>target</label>
        <input
          type="text"
          value={targetId}
          onChange={(e) => setTargetId(e.currentTarget.value)}
        />
      </div>
      <button onClick={connect}>Connect</button>
      <button onClick={message}>PING</button>

      <hr></hr>

      <button onClick={call}>Call</button>
      <div>
        <label>My Stream</label>
        {stream && (
          <Video srcObject={stream} style={{ height: "200px" }} autoPlay />
        )}
      </div>

      <div>
        <label>Target Stream</label>
        {targetStream && (
          <Video
            srcObject={targetStream}
            style={{ height: "200px" }}
            autoPlay
          />
        )}
      </div>
    </div>
  );
}
