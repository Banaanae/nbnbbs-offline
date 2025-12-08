import { Player } from "../../player.js";
import { ByteStream } from "../../bytestream.js";
import { Config } from "../../config.js";
import { Hero } from "../../hero.js";
import { Messaging } from "../../messaging.js";
import { Long } from "../../long.ts"
import { DeletePlayerMapResponseMessage } from "../server/DeletePlayerMapResponseMessage.js"

export class DeletePlayerMapMessage {
    static decode(player: Player, stream: ByteStream): number {
	    let id = stream.readVlong(); // map id
	    return id;
        }
        
    static execute(player: Player, stream: ByteStream): void {
        Messaging.sendOfflineMessage(22101, DeletePlayerMapResponseMessage.encode(player, this.decode(player, stream)));
    }
}
