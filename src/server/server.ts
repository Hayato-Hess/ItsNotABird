import {createServer} from "node:http";
import {networkInterfaces} from "node:os";
import {fileURLToPath} from "node:url";
import express from "express";
import {Server} from "socket.io";
import type {ClientToServerEvents, ServerToClientEvents,} from "../shared/message.js";
import {RoomId} from "../shared/Data/RoomId.js";
import {Room} from "./Data/Room.js";
import {Player} from "./Data/Player.js";
import {PlayerId} from "../shared/Data/PlayerId.js";
import {GameState} from "../shared/Data/GameState.js";

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
    const playerId : PlayerId = socket.id;

    const newPlayer = new Player(playerId, playerName);
    room.join(newPlayer);
    socket.join(roomId);
    roomMembership.set(playerId, roomId);

    roomMap.set(roomId, room);

    callback(room.toSharedRoom());
  });

  socket.on("JoinRoom",  (playerName, roomId : RoomId, callback) => {
    const room = roomMap.get(roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    const playerId : PlayerId = socket.id;
    const newPlayer = new Player(playerId, playerName);
    room.join(newPlayer);
    socket.join(roomId);
    roomMembership.set(playerId, roomId);

    callback(room.toSharedRoom());
  });

  socket.on("SetReady", newState => {
    const playerId : PlayerId = socket.id;
    const room = findRoom(playerId);

    const player = room.players.find(p=>p.Id == playerId)
    if(!player){
      throw new Error("Player not found")
    }
    player.IsReady = newState;

    let game = room.game;
    if(room.allPlayersReady()){
      game.start();
    }

    io.to(room.id).emit("RoomUpdate", room.toSharedRoom());

    if(game.getGameData().gameState == GameState.Started){
      io.to(room.id).emit("GameStart", <PlayerId> game.getGameData().currentActivePlayer)
    }
  });

  socket.on("UpdateCanvas",  (canvas) => {
    const playerId : PlayerId = socket.id;
    const room = findRoom(playerId);

    if(room?.game.getGameData().currentActivePlayer != playerId){
      console.log("a non active player is updating the canvas")
      //throw new Error("Not the active player!") // todo
    }

    room?.game.updateCanvas(canvas);

    io.to(room.id).emit("UpdateCanvas", canvas);
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

function findRoom(playerId: string) : Room {
  const roomId: RoomId | undefined = roomMembership.get(playerId);
  if (!roomId) {
    throw new Error("Room not found")
  }

  return <Room>roomMap.get(roomId);
}
