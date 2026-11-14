import {GameData} from "./Data/GameData.js";
import {Canvas} from "../shared/Data/Canvas/Canvas.js";
import {Room} from "./Data/Room.js";
import {GameState} from "../shared/Data/GameState.js";

export class Game {
    private _gameData: GameData;
    private _canvas : Canvas;
    private _parent : Room;

    constructor(room : Room) {
        this._gameData = new GameData();
        this._canvas = {Emojis : []};
        this._parent = room;
    }

    public updateCanvas(canvas : Canvas) : void {
        this._canvas = canvas;
    }

    get canvas(): Canvas {
        return this._canvas;
    }

    getGameData = (): GameData => this._gameData;

    start() {
        this._gameData.currentActivePlayer = this._parent.players[Math.floor(Math.random() * this._parent.players.length)].Id
        this._gameData.gameState = GameState.Started;
    }
}