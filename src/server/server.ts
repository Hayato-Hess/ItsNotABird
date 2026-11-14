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
import {WordToGuess} from "../shared/Data/WordToGuess.js";

const PORT = Number(process.env.PORT ?? 3000);

const app = express();
app.use(express.static(fileURLToPath(new URL("../client", import.meta.url))));

const http = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(http);

const roomMap = new Map<RoomId, Room>();
const roomMembership = new Map<PlayerId, RoomId>();

io.on("connection", (socket) => {
  console.log("connected", socket.id);

  socket.on("CreateRoom", (playerName, callback) => {
    const roomId: RoomId = Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase();
    const room = new Room(roomId);
    const playerId: PlayerId = socket.id;

    const newPlayer = new Player(playerId, playerName, socket);
    room.join(newPlayer);
    socket.join(roomId);
    roomMembership.set(playerId, roomId);

    roomMap.set(roomId, room);

    callback({
      success: true,
      data: room.toSharedRoom(),
    });
  });

  socket.on("JoinRoom", (playerName, roomId: RoomId, callback) => {
    roomId = roomId.toUpperCase().trim();

    const room = roomMap.get(roomId);
    if (!room) {
      callback({
        success: false,
        error: "Room not found",
      });
      return;
    }

    const playerId: PlayerId = socket.id;
    const newPlayer = new Player(playerId, playerName, socket);
    room.join(newPlayer);
    socket.join(roomId);
    roomMembership.set(playerId, roomId);

    callback({
      success: true,
      data: room.toSharedRoom(),
    });
    sendRoomUpdate(room);
    if(room.game.getGameData().gameState == GameState.Started){
      io.to(room.id).emit("UpdateCanvas", room.game.getGameData().canvas);
    }
  });

  socket.on("ToggleReady", (callback) => {
    const playerId: PlayerId = socket.id;
    const room = findRoom(playerId);
    if (!room) {
      callback({
        success: false,
        error: "Room not found",
      });
      return;
    }

    const player = room.players.find((p) => p.Id == playerId);
    if (!player) {
      callback({
        success: false,
        error: "player not found",
      });
      return;
    }
    player.IsReady = !player.IsReady;

    let game = room.game;
    if (room.allPlayersReady()) {
      game.start();
    }

    io.to(room.id).emit("RoomUpdate", room.toSharedRoom());
    if (game.getGameData().gameState == GameState.Started) {
      sendGameStartEvents(room);
    }
  });

  socket.on("UpdateCanvas", (canvas, callback) => {
    const playerId: PlayerId = socket.id;
    const room = findRoom(playerId);
    if (!room) {
      callback({
        success: false,
        error: "Room not found",
      });
      return;
    }

    if (room.game.getGameData().currentActivePlayer != playerId) {
      callback({
        success: false,
        error: "a non active player is updating the canvas",
      });
      return;
    }

    room.game.updateCanvas(canvas);
    io.to(room.id).emit("UpdateCanvas", canvas);
  });

  socket.on("Message", (message, callback) => {
    const playerId: PlayerId = socket.id;
    let player = findPlayer(playerId);
    const room = findRoom(playerId);
    if (!room) {
      callback({
        success: false,
        error: "Room not found",
      });
      return;
    }

    io.to(room.id).emit("Message", {
      message: message,
      source: MessageSource.Player,
      sender: player?.Id,
    } satisfies MessagePayload);

    if (room.game.isCorrectMessage(message) && player) {
      handleCorrectMessageReceived(room, player, message);
      return;
    }

    let distanceToSearchedWord = room.game.getLevenshteinDistanceToSearchedWord(message);
    if(distanceToSearchedWord && distanceToSearchedWord < 3 && player){
      player.Socket.emit("Message", {
        message: "Close Guess! (Distance: "+distanceToSearchedWord+")",
        source: MessageSource.Server
      })
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

function sendGameStartEvents(room: Room) {
  let newActivePlayer = <PlayerId>room.game.getGameData().currentActivePlayer;
  let player = findPlayer(newActivePlayer);

  io.to(room.id).emit("Message", {
    message: "starting new round - active player: " + player?.Name,
    source: MessageSource.Server,
  } satisfies MessagePayload);

  let searchedWord = <WordToGuess>room.game.getGameData().currentSearchedWord;
  io.to(room.id).emit("GameStart", newActivePlayer, searchedWord.category);
  player?.Socket.emit("WordToGuess", searchedWord);
}

function sendGameEnd(room: Room) {
  io.to(room.id).emit("Message", {
    message: "game ended",
    source: MessageSource.Server,
  } satisfies MessagePayload);

  io.to(room.id).emit("GameEnd");
}

function handleCorrectMessageReceived(room: Room, sender: Player, message: string) {
  room.game.correctMessageSent(sender.Id);
  sendRoomUpdate(room);

  io.to(room.id).emit("RoundEnd");

  io.to(room.id).emit("Message", {
    message: "correct guess '"+message+"' received from: " + sender?.Name,
    source: MessageSource.Server,
  } satisfies MessagePayload);

  if (room.game.getGameData().gameState == GameState.GameEnd) {
    sendGameEnd(room);
  } else {
    sendGameStartEvents(room);
  }
}

function findRoom(playerId: string): Room | undefined {
  const roomId: RoomId | undefined = roomMembership.get(playerId);
  if (!roomId) {
    return undefined;
  }

  return <Room>roomMap.get(roomId);
}

function findPlayer(playerId: PlayerId): Player | undefined {
  let room = findRoom(playerId);
  if (!room) return undefined;

  return room.players.find((value) => value.Id == playerId);
}

function sendRoomUpdate(room: Room) {
  io.to(room.id).emit("RoomUpdate", room.toSharedRoom());
}
