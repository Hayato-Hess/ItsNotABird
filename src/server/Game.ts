import {GameData} from "./Data/GameData.js";
import {Canvas} from "../shared/Data/Canvas/Canvas.js";
import {Room} from "./Data/Room.js";
import {GameState} from "../shared/Data/GameState.js";
import {PlayerId} from "../shared/Data/PlayerId.js";
import {distance} from 'fastest-levenshtein';

export class Game {
    private _gameData: GameData;
    private _room : Room;

    constructor(room: Room, totalRoundNumber: number) {
        this._gameData = new GameData();
        this._gameData.totalRoundNumber = totalRoundNumber;
        this._room = room;
    }

    getGameData = (): GameData => this._gameData;

    public updateCanvas(canvas : Canvas) : void {
        this._gameData.updateCanvas(canvas);
    }

    start() {
        this.setActivePlayerToRandom();
        this.selectRandomWord();
        this._gameData.gameState = GameState.Started;
    }

    private selectRandomWord() {
        this._gameData.currentSearchedWord = this._gameData.getNextWordListItem();
    }

    private setActivePlayerToRandom() {
        this._gameData.currentActivePlayer = this._room.players[Math.floor(Math.random() * this._room.players.length)].Id
    }

    isCorrectMessage(message:string) : boolean {
        message = message.toLowerCase();
        message = message.trim();

        let word = this._gameData.currentSearchedWord?.word;
        word = word?.toLocaleLowerCase();
        word = word?.trim();

        return word === message;
    }

    getLevenshteinDistanceToSearchedWord(message:string) : number | undefined {
        message = message.toLowerCase();
        message = message.trim();

        let word = this._gameData.currentSearchedWord?.word;
        word = word?.toLocaleLowerCase();
        word = word?.trim();
        if(!word){
            return -1;
        }

        return distance(message, word);
    }

    correctMessageSent(sender: PlayerId) : number {
        let currentPlayerIndex = this._room.players.findIndex(player => player.Id === this._gameData.currentActivePlayer);

        if(currentPlayerIndex == -1){
            this.setActivePlayerToRandom();
        }else{
            this._gameData.currentActivePlayer = this._room.players[(currentPlayerIndex+1)%this._room.players.length].Id;
        }
        this.selectRandomWord();

        this._gameData.currentTurnNumber++;
        if(currentPlayerIndex == this._room.players.length-1){
            this._gameData.currentRoundNumber++;
        }
        if(this._gameData.currentRoundNumber >= this._gameData.totalRoundNumber){
            this._gameData.gameState = GameState.GameEnd;
            this._gameData.currentActivePlayer = null;
            this._gameData.currentTurnNumber = 0;
        }

        let senderPlayer = this._room.players.find(player => player.Id == sender);
        if (!senderPlayer) {
            return 0;
        }

        senderPlayer.Score += 100;

        return senderPlayer.Score;
    }
}