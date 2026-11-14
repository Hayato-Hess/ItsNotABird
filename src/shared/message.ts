import {RoomId} from "./Data/RoomId.js";
import {Canvas} from "./Data/Canvas/Canvas.js";
import {Player} from "./Data/Player.js";
import {PlayerId} from "./Data/PlayerId.js";
import {MessagePayload} from "./Data/Messages/MessagePayload.js";

export interface ServerToClientEvents {
  PlayerUpdate: (updatedPlayers : Player[]) => void;
  Message: (message : MessagePayload) => void;
  UpdateCanvas: (Canvas : Canvas) => void;

  // state changes
  GameStart: (newActivePlayer : PlayerId) => void;
  RoundEnd: () => void;
  GameEnd: () => void;
}

export interface ClientToServerEvents {
  test: (msg: string) => void;

  CreateRoom: (callback: (roomId: RoomId) => void) => void;
  JoinRoom: (roomId : RoomId) => void;
  SetReady: (newState: boolean) => void;
  Message: (message: string) => void;
  UpdateCanvas: (newCanvas: Canvas) => void;
}
