import {GameState} from "./GameState.js";
import {User} from "./User.js";

export type Room = {
    id: string;
    users: User[];
    gameState: GameState;
};
