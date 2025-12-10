import { TeamMember } from "./teammember.js"
import { Long } from "../long.js"
import { ByteStream} from "../bytestream.js"

export class TeamEntry {
  id: Long;
  type = 0;
  locationID = 0;
  eventSlot = 0;
  teamMembers: TeamMember[] = [];
  constructor(id: Long, type: number, eventSlot: number) {
    this.id = id;
    this.type = type;
    this.eventSlot = eventSlot;
  }

  encode(stream: ByteStream): ByteStream {
    stream.writeVint(this.type);
    stream.writeBoolean(this.type == 1);
    stream.writeVint(3);
    stream.writeLong(this.id.high, this.id.low)
    stream.writeVint(0);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    for (let i = 0; i < 3; i++) {
      stream.writeVint(0);
    }
    stream.writeVint(0); // location id
    stream.writeBoolean(false); // battle player map
    stream.writeVint(this.teamMembers.length);
    stream = this.teamMembers.reduce((prev, x) => { return x.encode(prev) }, stream);
    stream.writeVint(0); // invites
    stream.writeVint(0); // join requests
    stream.writeVint(0); // disabled bots
    stream.writeBoolean(false); // enable chat
    stream.writeBoolean(true); // accessory
    stream.writeBoolean(true); // gears
    stream.writeBoolean(false); // mods
    return stream;
  }
}
