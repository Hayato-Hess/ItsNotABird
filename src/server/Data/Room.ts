import {RoomId} from "../../shared/Data/RoomId.js";
import {Game} from "../Game.js";
import {SharedRoom} from "../../shared/Data/SharedRoom.js";
import {Player} from "./Player.js";
import {PlayerId} from "../../shared/Data/PlayerId.js";

export class Room {
    id: RoomId;
    players: Player[];
    game: Game;

    constructor(RoomId: RoomId) {
        this.id = RoomId;
        this.players = [];
        this.game = new Game(this);
    }

    public join(newPlayer: Player) {
        this.players.push(newPlayer);
    }

    public leave(playerId: PlayerId) {
        this.players = this.players.filter(p => p.Id != playerId);
    }

    public isEmpty() : boolean {
        return this.players.length == 0;
    }

    public allPlayersReady() : boolean {
        if(this.players.length <= 1){
            return false;
        }

        for (const player of this.players) {
            if(!player.IsReady) {
                return false;
            }
        }
        return true;
    }

    public toSharedRoom() : SharedRoom{
        return {
            id : this.id,
            gameState : this.game.getGameData().toSharedGameData(),
            players : this.players.map(player => player.toSharedPlayer())
        };
    }
}