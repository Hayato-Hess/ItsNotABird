import {PlayerId} from "../../shared/Data/PlayerId.js";

export type GameState = {
    currentActivePlayer : PlayerId;
    currentSearchedWord : string;

}
