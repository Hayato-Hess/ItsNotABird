import {PlayerId} from "../../shared/Data/PlayerId.js";
import {SharedPlayer} from "../../shared/Data/SharedPlayer.js";
import type {ClientToServerEvents, ServerToClientEvents} from "../../shared/message.js";
import {Socket} from "socket.io";

export class Player {
    Id: PlayerId;
    Name: string;
    IsReady: boolean = false;
    Score : number = 0;
    Socket: Socket<ClientToServerEvents, ServerToClientEvents>;

    constructor(id: PlayerId, Name: string, socket: Socket<ClientToServerEvents, ServerToClientEvents>) {
        this.Id = id;
        this.Name = Name;
        this.Socket = socket;
    }

    public toSharedPlayer() : SharedPlayer{
        return {
            Id : this.Id,
            Name : this.Name,
            IsReady : this.IsReady,
            Score : this.Score,
        };
    }
}