import "./global.css";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { ClientStateProvider } from "./useClientState";
import { io, type Socket } from "socket.io-client";
import { ToastContainer } from "react-toastify";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../shared/message";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
createRoot(document.getElementById("root")!).render(
  <ClientStateProvider socket={socket}>
    <App />
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar
      newestOnTop
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable={false}
      pauseOnHover={false}
      theme="dark"
    />
  </ClientStateProvider>,
);
