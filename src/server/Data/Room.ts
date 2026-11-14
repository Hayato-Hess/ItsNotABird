import {RoomId} from "../../shared/Data/RoomId.js";
import {Game} from "../Game.js";
import {SharedRoom} from "../../shared/Data/SharedRoom.js";
import {Player} from "./Player.js";

export class Room {
    id: RoomId;
    players: Player[];
    game: Game;

    constructor(RoomId: RoomId) {
        this.id = RoomId;
        this.players = [];
        this.game = new Game();
    }

    public join(newPlayer: Player) {
        this.players.push(newPlayer);
    }

    public toSharedRoom() : SharedRoom{
        return {
            id : this.id,
            gameState : this.game.getGameState().toSharedGameState(),
            players : this.players.map(player => player.toSharedPlayer())
        };
    }
}