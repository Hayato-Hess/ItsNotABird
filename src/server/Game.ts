import {GameState} from "./Data/GameState.js";

export class Game {
    private gameState: GameState;

    constructor() {
        this.gameState = new GameState();
    }


    getGameState = (): GameState => this.gameState;
}