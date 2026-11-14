import {PlayerId} from "./PlayerId.js";

export type Player = {
    Id: PlayerId;
    Name: string;
    IsReady: boolean;
    Score : number;
}