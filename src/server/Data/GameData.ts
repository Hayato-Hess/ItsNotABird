import {PlayerId} from "../../shared/Data/PlayerId.js";
import {SharedGameData} from "../../shared/Data/SharedGameData.js";
import {GameState} from "../../shared/Data/GameState.js";
import {WordToGuess} from "../../shared/Data/WordToGuess.js";
import {allWordList} from "./AllWordList.js";
import {Canvas} from "../../shared/Data/Canvas/Canvas.js";

export class GameData {
    currentSearchedWord : WordToGuess | null = null;
    currentActivePlayer : PlayerId | null = null;
    gameState: GameState = GameState.Looby;
    wordList : WordToGuess[] = [];
    canvas : Canvas = {Emojis : []};
    totalRoundNumber : number = 1;
    currentRoundNumber : number = 0;
    currentTurnNumber : number = 0;

    public toSharedGameData() : SharedGameData{
        return {
            currentActivePlayer : this.currentActivePlayer,
            gameState : this.gameState,
        };
    }

    public updateCanvas(canvas : Canvas) : void {
        this.canvas = canvas;
    }

    public getNextWordListItem() : WordToGuess{
        if(this.wordList.length == 0){
            this.wordList = this.newRandomList();
        }

        return <WordToGuess>this.wordList.pop();
    }

    private newRandomList(): WordToGuess[]{
        let result = allWordList.slice();
        for(let i = 0; i < result.length; i++){
            const j = Math.floor(Math.random() * result.length);
            [result[i], result[j]] = [result[j], result[i]];
        }

        return result;
    }
}
