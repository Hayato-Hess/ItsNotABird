import { Canvas } from "./Data/Canvas/Canvas.js";
import { PlayerId } from "./Data/PlayerId.js";
import { MessagePayload } from "./Data/Messages/MessagePayload.js";
import { SharedRoom } from "./Data/SharedRoom.js";
import { RoomId } from "./Data/RoomId.js";
import { ServerResponse } from "./Data/ServerResponse.js";
import {WordToGuess} from "./Data/WordToGuess.js";

export interface ServerToClientEvents {
  RoomUpdate: (updatedRoom: SharedRoom) => void;
  Message: (message: MessagePayload) => void;
  UpdateCanvas: (canvas: Canvas) => void;
  WordToGuess: (wordToGuess: WordToGuess) => void;

  // state changes
  GameStart: (newActivePlayer: PlayerId, category: string) => void;
  RoundEnd: () => void;
  GameEnd: () => void;
}

export interface ClientToServerEvents {
  test: (msg: string) => void;

  CreateRoom: (
    playerName: string,
    roundNumber: number,
    callback: (room: ServerResponse<SharedRoom>) => void,
  ) => void;
  JoinRoom: (
    playerName: string,
    roomId: RoomId,
    callback: (room: ServerResponse<SharedRoom>) => void,
  ) => void;
  LeaveRoom: (
      callback: (room: ServerResponse<void>) => void,
  ) => void;

  ToggleReady: (
    callback: (error: ServerResponse<void>) => void,
  ) => void;
  Message: (
    message: string,
    callback: (error: ServerResponse<void>) => void,
  ) => void;
  UpdateCanvas: (
    newCanvas: Canvas,
    callback: (room: ServerResponse<void>) => void,
  ) => void;
}
