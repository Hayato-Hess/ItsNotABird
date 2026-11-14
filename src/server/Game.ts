import {GameState} from "./Data/GameState.js";
import {Canvas} from "../shared/Data/Canvas/Canvas.js";

export class Game {
    private gameState: GameState;
    private _canvas : Canvas;

    constructor() {
        this.gameState = new GameState();
        this._canvas = {Emojis : []};
    }

    public updateCanvas(canvas : Canvas) : void {
        this._canvas = canvas;
    }

    get canvas(): Canvas {
        return this._canvas;
    }

    getGameState = (): GameState => this.gameState;
}