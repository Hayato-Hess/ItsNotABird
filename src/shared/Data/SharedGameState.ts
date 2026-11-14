import {PlayerId} from "./PlayerId.js";

export type SharedGameState = {
    currentActivePlayer : PlayerId | null;
}