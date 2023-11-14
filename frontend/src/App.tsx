import "./App.css";
import { PeerWebRtc } from "./PeerWebRtc";
import { PeerWebRtc2 } from "./PeerWebRtc2";
import { Chat, Supabase } from "./Supabase";

function App() {
  return (
    <>
      <h1>Vite + React</h1>
      <Chat />
      <Supabase />
      <PeerWebRtc2 />
    </>
  );
}

export default App;
