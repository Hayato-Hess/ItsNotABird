import {Canvas} from "./Data/Canvas/Canvas.js";
import {PlayerId} from "./Data/PlayerId.js";
import {MessagePayload} from "./Data/Messages/MessagePayload.js";
import {Room} from "./Data/Room.js";

export interface ServerToClientEvents {
  RoomUpdate: (updatedRoom : Room) => void;
  Message: (message : MessagePayload) => void;
  UpdateCanvas: (Canvas : Canvas) => void;

  // state changes
  GameStart: (newActivePlayer : PlayerId) => void;
  RoundEnd: () => void;
  GameEnd: () => void;
}

export interface ClientToServerEvents {
  test: (msg: string) => void;

  CreateRoom: (playerName : string, callback: (room: Room) => void) => void;
  JoinRoom: (playerName : string, callback: (room: Room) => void) => void;

  SetReady: (newState: boolean) => void;
  Message: (message: string) => void;
  UpdateCanvas: (newCanvas: Canvas) => void;
}
