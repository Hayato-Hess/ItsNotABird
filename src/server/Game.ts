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
        message = this.stripUnnecessaryCharacters(message);

        let word = this._gameData.currentSearchedWord?.word;
        if(!word){
            return false;
        }
        word = this.stripUnnecessaryCharacters(word);

        return word === message;
    }

    private stripUnnecessaryCharacters(word:string) : string{
        word = word.toLowerCase();
        word = word.replaceAll("_", "");
        word = word.replaceAll(" ", "");
        word = word.replaceAll("-", "");
        word = word.trim();

        return word;
    }

    getLevenshteinDistanceToSearchedWord(message:string) : number | undefined {
        message = this.stripUnnecessaryCharacters(message);

        let word = this._gameData.currentSearchedWord?.word;
        if(!word){
            return -1;
        }
        word = this.stripUnnecessaryCharacters(word);

        return distance(message, word);
    }

    correctMessageSent(sender: PlayerId) : number {
        let currentActivePlayer = this._room.players.find(player => player.Id === this._gameData.currentActivePlayer);
        if(currentActivePlayer){
            currentActivePlayer.Score += 50;
        }

        this.nextTurn();

        let senderPlayer = this._room.players.find(player => player.Id == sender);
        if (!senderPlayer) {
            return 0;
        }
        senderPlayer.Score += 100;
        return senderPlayer.Score;
    }

    public nextTurn() {
        let currentPlayerIndex = this._room.players.findIndex(player => player.Id === this._gameData.currentActivePlayer);

        if (currentPlayerIndex == -1) {
            this.setActivePlayerToRandom();
        } else {
            this._gameData.currentActivePlayer = this._room.players[(currentPlayerIndex + 1) % this._room.players.length].Id;
        }
        this.selectRandomWord();

        this._gameData.currentTurnNumber++;
        if (this._gameData.currentTurnNumber >= this._room.players.length) {
            this._gameData.currentTurnNumber = 0;
            this._gameData.currentRoundNumber++;
        }
        if (this._gameData.currentRoundNumber >= this._gameData.totalRoundNumber) {
            this._gameData.gameState = GameState.GameEnd;
            this._gameData.currentActivePlayer = null;
        }
    }
}