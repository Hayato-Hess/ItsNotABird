import {GameState} from "./GameState.js";
import {Player} from "../../shared/Data/Player.js";
import {RoomId} from "../../shared/Data/RoomId.js";

export type Room = {
    id: RoomId;
    users: Player[];
    gameState: GameState;
};
