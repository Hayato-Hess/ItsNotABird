import {PlayerId} from "../../shared/Data/PlayerId.js";
import {SharedRoom} from "../../shared/Data/SharedRoom.js";
import {SharedGameState} from "../../shared/Data/SharedGameState.js";

export class GameState {
    currentSearchedWord : string | null = null;
    currentActivePlayer : PlayerId | null = null;

    public toSharedGameState() : SharedGameState{
        return {
            currentActivePlayer : this.currentActivePlayer
        };
    }
}
