import { Player } from "../../../player.js";
import { ByteStream } from "../../../bytestream.js";
import { Config } from "../../../config.js";
import { Hero } from "../../../hero.js";
import { Messaging } from "../../../messaging.js";
import { TeamEntry } from "../../../teams/teamentry.js";
import { Long } from "../../../long.js";
import { TeamMember } from "../../../teams/teammember.js";

export class TeamCreateMessage {
    static decode(player: Player, stream: ByteStream): any {
      stream.readLong();
      let type = stream.readVint();
      let slot = stream.readVint();
      stream.readVint();
      return { type: type, slot: slot };
    }

    static execute(player: Player, stream: ByteStream): void {
      let data = this.decode(player, stream);
      let entry = new TeamEntry(new Long(0, 1), data.type, 0, 1);
      entry.members.push(new TeamMember(player, 11, true, 0, 1000));
      console.log("entry");
      Messaging.sendOfflineMessage(24124, entry.encode());      
    }
}
