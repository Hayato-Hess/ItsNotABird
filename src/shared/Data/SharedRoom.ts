import {SharedPlayer} from "./SharedPlayer.js";
import {RoomId} from "./RoomId.js";
import {SharedGameState} from "./SharedGameState.js";

export type SharedRoom = {
    id: RoomId;
    players: SharedPlayer[];
    gameState: SharedGameState;
};
