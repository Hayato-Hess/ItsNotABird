import "./global.css";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { ClientStateProvider } from "./useClientState";
import { io, type Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../shared/message";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
createRoot(document.getElementById("root")!).render(
  <ClientStateProvider socket={socket}>
    <App />
  </ClientStateProvider>,
);
