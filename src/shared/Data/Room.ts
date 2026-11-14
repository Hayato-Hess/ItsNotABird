import {Player} from "./Player.js";
import {RoomId} from "./RoomId.js";
import {SharedGameState} from "./SharedGameState.js";

export type Room = {
    id: RoomId;
    players: Player[];
    gameState: SharedGameState;
};
