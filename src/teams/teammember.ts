import { PlayerDisplayData } from "../playerdisplaydata.js"
import { Player } from "../player.js"
import { ByteStream } from "../bytestream.js"

export class TeamMember {
  powerlevel = 11;
  isOwner = true;
  state = 0;
  heroTrophies = 0;
  playerDisplayData: PlayerDisplayData;
  characterID = 0;
  ready = false;

  constructor(player: Player, powerlevel: number, isOwner: boolean, state: numher, heroTrophies: number) {
    this.powerlevel = powerlevel;
    this.isOwner = isOwner;
    this.state = state;
    this.heroTrophies = heroTrophies;
    this.characterID = player.selectedBrawlers[0];
    this.playerDisplayData = new PlayerDisplayData(player.name, player.thumbnail, player.namecolor);
  } 

  encode(stream: ByteStream): ByteStream {
    stream.writeBoolean(this.isOwner);
    stream.writeLong(0, 1); // acc id
    stream.writeDataReference({high: 16, low: this.characterID});
    stream.writeDataReference({high: 29, low: 0}); // skin
    stream.writeVint(1000);
    stream.writeVint(this.heroTrophies);
    stream.writeVint(this.heroTrophies); // highest
    stream.writeVint(this.powerlevel);
    stream.writeVint(this.state);
    stream.writeBoolean(this.ready);
    stream.writeVint(0); // team index
    for (let i = 0; i < 6; i++) {
      stream.writeVint(0);
    }
    stream = this.playerDisplayData.encode(stream);
    for (let i = 0; i < 2; i++) {
      stream.writeDataReference({high: 23, low: 0});
    }
    for (let i = 0; i < 2; i++) {
      stream.writeDataReference({high: 62, low: 0});
    }
    stream.writeVint(0); // hypercharge
    stream.writeVint(0);
    return stream;
  }
};
