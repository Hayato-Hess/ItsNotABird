import {PlayerId} from "../../shared/Data/PlayerId.js";
import {SharedGameData} from "../../shared/Data/SharedGameData.js";
import {GameState} from "../../shared/Data/GameState.js";

export class GameData {
    currentSearchedWord : string | null = null;
    currentActivePlayer : PlayerId | null = null;
    gameState: GameState = GameState.Looby;

    public toSharedGameData() : SharedGameData{
        return {
            currentActivePlayer : this.currentActivePlayer,
            gameState : this.gameState,
        };
    }
}
