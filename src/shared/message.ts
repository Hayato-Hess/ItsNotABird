import {Canvas} from "./Data/Canvas/Canvas.js";
import {PlayerId} from "./Data/PlayerId.js";
import {MessagePayload} from "./Data/Messages/MessagePayload.js";
import {SharedRoom} from "./Data/SharedRoom.js";
import {RoomId} from "./Data/RoomId.js";

export interface ServerToClientEvents {
  RoomUpdate: (updatedRoom : SharedRoom) => void;
  Message: (message : MessagePayload) => void;
  UpdateCanvas: (Canvas : Canvas) => void;

  // state changes
  GameStart: (newActivePlayer : PlayerId) => void;
  RoundEnd: () => void;
  GameEnd: () => void;
}

export interface ClientToServerEvents {
  test: (msg: string) => void;

  CreateRoom: (playerName : string, callback: (room: SharedRoom) => void) => void;
  JoinRoom: (playerName : string, roomId : RoomId, callback: (room: SharedRoom) => void) => void;

  SetReady: (newState: boolean) => void;
  Message: (message: string) => void;
  UpdateCanvas: (newCanvas: Canvas) => void;
}
