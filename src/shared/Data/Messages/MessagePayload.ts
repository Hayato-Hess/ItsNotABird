import {MessageSource} from "./MessageSource.js";

export type MessagePayload = {
    message : string;
    source: MessageSource;
}