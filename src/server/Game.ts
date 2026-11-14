import {GameData} from "./Data/GameData.js";
import {Canvas} from "../shared/Data/Canvas/Canvas.js";
import {Room} from "./Data/Room.js";
import {GameState} from "../shared/Data/GameState.js";
import {PlayerId} from "../shared/Data/PlayerId.js";

export class Game {
    private _gameData: GameData;
    private _canvas : Canvas;
    private _room : Room;

    constructor(room : Room) {
        this._gameData = new GameData();
        this._canvas = {Emojis : []};
        this._room = room;
    }

    public updateCanvas(canvas : Canvas) : void {
        this._canvas = canvas;
    }

    get canvas(): Canvas {
        return this._canvas;
    }

    getGameData = (): GameData => this._gameData;

    start() {
        this.setActivePlayerToRandom();
        this._gameData.currentSearchedWord = "bird"; // todo wordlist this
        this._gameData.gameState = GameState.Started;
    }

    private setActivePlayerToRandom() {
        this._gameData.currentActivePlayer = this._room.players[Math.floor(Math.random() * this._room.players.length)].Id
    }

    isCorrectMessage(message:string) : boolean {
        return this._gameData.currentSearchedWord === message;
    }

    correctMessageSent(sender: PlayerId) : number {
        let index = this._room.players.findIndex(player => player.Id === this._gameData.currentActivePlayer);
        if(index == -1){
            this.setActivePlayerToRandom();
        }else{
            this._gameData.currentActivePlayer = this._room.players[(index+1)%this._room.players.length].Id;
        }

        let senderPlayer = this._room.players.find(player => player.Id == sender);
        if (!senderPlayer) {
            return 0;
        }

        senderPlayer.Score += 100;
        return senderPlayer.Score;
    }
}