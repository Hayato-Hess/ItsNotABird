import { createServer } from "node:http";
import { networkInterfaces } from "node:os";
import { fileURLToPath } from "node:url";
import express from "express";
import { Server } from "socket.io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../shared/message.js";
import {RoomId} from "../shared/Data/RoomId.js";
import {SharedPlayer} from "../shared/Data/SharedPlayer.js";
import {Room} from "./Data/Room.js";
import {Player} from "./Data/Player.js";
import {PlayerId} from "../shared/Data/PlayerId.js";

const PORT = Number(process.env.PORT ?? 3000);

const app = express();
app.use(express.static(fileURLToPath(new URL("../client", import.meta.url))));

const http = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(http);

const roomMap =  new Map<RoomId, Room>();
const roomMembership =  new Map<PlayerId, RoomId>();


io.on("connection", (socket) => {
  console.log("connected", socket.id);

  socket.on("CreateRoom", (playerName, callback) => {
    const roomId : RoomId = Math.random().toString(36).substring(2, 7).toUpperCase();
    const room = new Room(roomId);

    const newPlayer = new Player(socket.id, playerName);
    room.join(newPlayer);

    roomMap.set(roomId, room);

    callback(room.toSharedRoom());
  });

  socket.on("JoinRoom",  (playerName, roomId, callback) => {
    const room = roomMap.get(roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    const newPlayer = new Player(socket.id, playerName);
    room.join(newPlayer);

    callback(room.toSharedRoom());
  });
});

http.listen(PORT, "0.0.0.0", () => {
  console.log(`http://localhost:${PORT}`);
  for (const addrs of Object.values(networkInterfaces())) {
    for (const a of addrs ?? []) {
      if (a.family === "IPv4" && !a.internal)
        console.log(`http://${a.address}:${PORT}`);
    }
  }
});
