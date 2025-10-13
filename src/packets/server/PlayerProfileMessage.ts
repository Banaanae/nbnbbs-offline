import { Player } from "../../player.js";
import { ByteStream } from "../../bytestream.js";
import { Config } from "../../config.js";

export class PlayerProfileMessage {
    static encode(player: Player): number[] {
        let stream = new ByteStream([]);

        /* ***************************************** */
        stream.writeVlong(player.id[0], player.id[1]);
        stream.writeDataReference({ high: 16, low: player.favouriteBrawler })

        const ownedBrawlersCount = Object.keys(player.ownedBrawlers).length; // weird way to do it ngl; ts is weird; https://stackoverflow.com/questions/60033542/typescript-record-item-count
        stream.writeVint(ownedBrawlersCount);

        for (const [_brawlerID, brawlerData] of Object.entries(player.ownedBrawlers)) {
            const brawlerID = Number(_brawlerID); // for some fucking reason brawlerID is a string now???
            stream.writeDataReference({ high: 16, low: brawlerID });
            stream.writeDataReference({ high: 0, low: -1 }); // skin
            stream.writeVint(brawlerData.trophies);
            stream.writeVint(brawlerData.highestTrophies);
            stream.writeVint(brawlerData.powerlevel);
            stream.writeVint(0);
        }

        stream.writeVint(4);
        stream.writeDataReference({ high: 20, low: 244444 });
        stream.writeDataReference({ high: 24, low: 6974 });
        stream.writeDataReference({ high: 25, low: 1337 });
        stream.writeDataReference({ high: 27, low: 1488 });

        /* ***************************************** */
        stream.writeString(player.name);
        stream.writeVint(100);
        stream.writeVint(28000000 + player.thumbnail);
        stream.writeVint(43000000 + player.namecolor);
        stream.writeVint(43000000);

        /* ***************************************** */
        stream.writeBoolean(false);
        stream.writeString("hello world");
        stream.writeVint(0);
        stream.writeVint(0);
        stream.writeVint(0);
        stream.writeDataReference({ high: 29, low: 0 })
        stream.writeDataReference({ high: 0, low: -1 });
        stream.writeDataReference({ high: 0, low: -1 });
        stream.writeDataReference({ high: 0, low: -1 });
        stream.writeDataReference({ high: 0, low: -1 });

        stream.writeBoolean(false);

        stream.writeDataReference({ high: 25, low: 0 });
        stream.writeVint(1);

        return stream.payload;
    }
}
