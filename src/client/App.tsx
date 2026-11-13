import { io, type Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../shared/message";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

export function App() {
  const test = () => {
    socket.emit("test", "blub");
  };

  return (
    <>
      <div>Hello World</div>
      <button onClick={test}>Send Blub</button>
    </>
  );
}
