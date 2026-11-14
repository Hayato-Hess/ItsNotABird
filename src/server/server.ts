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
import {MessagePayload} from "../shared/Data/Messages/MessagePayload.js";
import {MessageSource} from "../shared/Data/Messages/MessageSource.js";

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
      sendGameStart(room);
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

  socket.on("Message", (message) => {
    const playerId : PlayerId = socket.id;
    let player = findPlayer(playerId);
    const room = findRoom(playerId);

    io.to(room.id).emit("Message", {
      message: player?.Name + ": " + message,
      source: MessageSource.Server,
    } satisfies MessagePayload);

    if(room.game.isCorrectMessage(message) && player){
      handleCorrectMessageReceived(room, player);
    }
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

function sendGameStart(room: Room) {
  let newActivePlayer = <PlayerId>room.game.getGameData().currentActivePlayer;
  let player = findPlayer(newActivePlayer);

  io.to(room.id).emit("Message", {
    message: "starting new round - active player: " + player?.Name,
    source: MessageSource.Server,
  } satisfies MessagePayload);

  io.to(room.id).emit("GameStart", newActivePlayer);
}

function sendGameEnd(room: Room) {
  io.to(room.id).emit("Message", {
    message: "game ended",
    source: MessageSource.Server,
  } satisfies MessagePayload);

  io.to(room.id).emit("GameEnd");
}

function handleCorrectMessageReceived(room: Room, sender : Player) {
  room.game.correctMessageSent(sender.Id);
  io.to(room.id).emit("RoomUpdate", room.toSharedRoom());

  io.to(room.id).emit("RoundEnd");

  io.to(room.id).emit("Message", {
    message: "correct message received from: " + sender?.Name,
    source: MessageSource.Server,
  } satisfies MessagePayload);

  if (room.game.getGameData().gameState == GameState.GameEnd) {
    sendGameEnd(room);
  } else {
    sendGameStart(room);
  }
}

function findRoom(playerId: string) : Room {
  const roomId: RoomId | undefined = roomMembership.get(playerId);
  if (!roomId) {
    throw new Error("Room not found")
  }

  return <Room>roomMap.get(roomId);
}

function findPlayer(playerId : PlayerId) : Player | undefined {
  let room = findRoom(playerId);
  return room.players.find(value => value.Id == playerId);
}
