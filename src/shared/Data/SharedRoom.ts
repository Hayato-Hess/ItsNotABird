import {SharedPlayer} from "./SharedPlayer.js";
import {RoomId} from "./RoomId.js";
import {SharedGameData} from "./SharedGameData.js";

export type SharedRoom = {
    id: RoomId;
    players: SharedPlayer[];
    gameState: SharedGameData;
};
