import {PlayerId} from "../../shared/Data/PlayerId.js";
import {SharedRoom} from "../../shared/Data/SharedRoom.js";
import {SharedPlayer} from "../../shared/Data/SharedPlayer.js";

export class Player {
    Id: PlayerId;
    Name: string;
    IsReady: boolean = false;
    Score : number = 0;

    constructor(id: PlayerId, Name: string) {
        this.Id = id;
        this.Name = Name;
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