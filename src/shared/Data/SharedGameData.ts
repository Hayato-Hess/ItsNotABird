import {PlayerId} from "./PlayerId.js";
import {GameState} from "./GameState.js";

export type SharedGameData = {
    currentActivePlayer : PlayerId | null;
    gameState: GameState;
}