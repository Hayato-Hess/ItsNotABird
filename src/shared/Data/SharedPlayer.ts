import {PlayerId} from "./PlayerId.js";

export type SharedPlayer = {
    Id: PlayerId;
    Name: string;
    IsReady: boolean;
    Score : number;
}