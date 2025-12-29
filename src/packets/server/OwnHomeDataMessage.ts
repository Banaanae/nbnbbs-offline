import { Player } from "../../player.js";
import { ByteStream } from "../../bytestream.js";
import { config, player } from "../../definitions.js";
import { Logger } from "../../utility/logger.js";

export class OwnHomeDataMessage {
  static encode(): number[] {
    let stream = new ByteStream([]);
    const currentTime = Date.now() / 1000 + 3600 * 4;

    stream.writeVInt(currentTime);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);

    stream.writeVInt(player.trophies);
    stream.writeVInt(player.highestTrophies);
    stream.writeVInt(player.highestTrophies);
    stream.writeVInt(player.trophyRoadTier);
    stream.writeVInt(player.xp);

    stream.writeDataReference(28, player.thumbnail);
    stream.writeDataReference(43, player.namecolor);
    stream.writeVInt(26);
    for (let i = 0; i < 26; i++) stream.writeVInt(i);

    stream.writeVInt(0); // selected skins
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(player.ownedSkins.length);
    player.ownedSkins.forEach((x) => stream.writeDataReference(29, x));
    stream.writeVInt(1080);
    for (let i = 0; i < 1080; i++) stream.writeDataReference(29, i);
    stream.writeVInt(0);
    stream.writeVInt(0); // e
    stream.writeVInt(player.highestTrophies);
    stream.writeVInt(0);
    stream.writeVInt(2);
    stream.writeBoolean(true);
    stream.writeVInt(player.tokenDoublers);
    stream.writeVInt(335442);
    stream.writeVInt(1001442);
    stream.writeVInt(5778642);
    stream.writeVInt(0);

    stream.writeVInt(120);
    stream.writeVInt(200);
    stream.writeVInt(0);

    stream.writeBoolean(true);
    stream.writeVInt(2);
    stream.writeVInt(2);
    stream.writeVInt(2);
    stream.writeVInt(0);
    stream.writeVInt(0);

    stream.writeVInt(0); // shop offers
    stream.writeVInt(20);
    stream.writeVInt(1428);

    stream.writeVInt(0);

    stream.writeVInt(1);
    stream.writeVInt(30);

    stream.writeByte(player.selectedBrawlers.length);
    for (const brawler of player.selectedBrawlers) {
      stream.writeDataReference(16, brawler);
    }
    stream.writeString(config.region);
    stream.writeString(config.supportedCreator);

    stream.writeVInt(23); // int values
    stream.writeVLong(config.rankedReputation, 41);
    stream.writeDataReference(2, 1);
    stream.writeDataReference(3, 0); /// tokens gained
    stream.writeDataReference(4, 0); // trophies gained
    stream.writeDataReference(6, 0); // demo account
    stream.writeDataReference(7, 0); // invites blocked
    stream.writeDataReference(8, 0); // star points gained
    stream.writeDataReference(9, 1); // shop star points
    stream.writeDataReference(10, 0); // power play trophies gained
    stream.writeDataReference(12, 1);
    stream.writeDataReference(14, 0); // coins gained
    stream.writeDataReference(15, 1); // social age
    stream.writeDataReference(16, 1);
    stream.writeDataReference(17, 0); // team chat muted
    stream.writeDataReference(18, 0); // esports button
    stream.writeDataReference(19, 0); // championship lives buy popup
    stream.writeDataReference(20, 0); // gems gained
    stream.writeDataReference(21, 1); // looking for team state
    stream.writeDataReference(22, 1);
    stream.writeDataReference(23, 0); // club trophies gained
    stream.writeDataReference(24, 1); // have already watched club league animation
    stream.writeDataReference(32447, 28);
    stream.writeDataReference(16, 5);

    stream.writeVInt(0);

    // brawl pass
    let pass32LVL = 0;
    let pass64LVL = 0;
    let pass96LVL = 0;

    let free32LVL = 0;
    let free64LVL = 0;
    let free96LVL = 0;

    for (const level of player.brawlPassFreeLevel) {
      if (level < 30) {
        free32LVL += 2 ** (level + 2);
      }
      if (level > 30) {
        free64LVL += 2 ** (level - 30);
      }
      if (level > 61) {
        free96LVL += 1 ** (level - 61);
      }
    }

    for (const level of player.brawlPassLevel) {
      if (level < 30) {
        pass32LVL += 2 ** (level + 2);
      }
      if (level > 29) {
        pass64LVL += 2 ** (level - 30);
      }
      if (level > 60) {
        pass96LVL += 1 ** (level - 61);
      }
    }

    // season data
    stream.writeVInt(1);
    stream.writeVInt(34); // season
    stream.writeVInt(player.passTokens);
    stream.writeBoolean(player.brawlPassActive);
    stream.writeVInt(0);
    stream.writeBoolean(false);

    stream.writeBoolean(true);
    stream.writeInt(pass32LVL);
    stream.writeInt(pass64LVL);
    stream.writeInt(pass96LVL);
    stream.writeInt(0);

    stream.writeBoolean(true);
    stream.writeInt(free32LVL);
    stream.writeInt(free64LVL);
    stream.writeInt(free96LVL);
    stream.writeInt(0);

    stream.writeBoolean(player.brawlPassPlusActive);
    stream.writeBoolean(true);
    stream.writeInt(0);
    stream.writeInt(0);
    stream.writeInt(0);
    stream.writeInt(0);

    stream.writeBoolean(true);
    stream.writeVInt(0);
    stream.writeVInt(1);
    stream.writeVInt(2);
    stream.writeVInt(0);

    stream.writeBoolean(true);
    stream.writeVInt(
      player.ownedThumbnails.length + player.ownedPins.length + 1,
    );
    player.ownedThumbnails.forEach((x) => {
      stream.writeDataReference(28, x);
      stream.writeVInt(0);
    });
    player.ownedPins.forEach((x) => {
      stream.writeDataReference(52, x);
      stream.writeVInt(0);
    });
    stream.writeDataReference(28, 186);
    stream.writeVInt(0);

    stream.writeBoolean(false); // powerleague data

    stream.writeInt(0);
    stream.writeVInt(0);
    stream.writeDataReference(16, player.favouriteBrawler);
    stream.writeBoolean(false);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);

    // daily data end
    // conf data

    stream.writeVInt(-1);

    // events
    stream.writeVInt(40);
    for (let i = 0; i < 40; i++) stream.writeVInt(i);

    stream.writeVInt(config.events.length);

    for (const event of config.events) {
      stream.writeVInt(-1);
      stream.writeVInt(event.slot);
      stream.writeVInt(event.slot);
      stream.writeVInt(0);
      stream.writeVInt(0);
      stream.writeVInt(10);
      stream.writeDataReference(15, event.mapID);
      stream.writeVInt(-1);
      stream.writeVInt(2); // MapStatus
      stream.writeString("");
      stream.writeVInt(0);
      stream.writeVInt(0);

      if (
        [20, 21, 22, 23, 24, 35, 36].includes(event.slot) &&
        event.championShipInfo
      ) {
        stream.writeVInt(event.championShipInfo.maxWins);
      } else {
        stream.writeVInt(0);
      }

      stream.writeVInt(0); // Modifiers
      stream.writeVInt(0); // Wins
      stream.writeVInt(6);
      stream.writeBoolean(false); // MapMaker map structure array
      stream.writeVInt(0);
      stream.writeBoolean(false); // Power League array entry
      stream.writeVInt(0);
      stream.writeVInt(0);

      if (
        [20, 21, 22, 23, 24, 35, 36].includes(event.slot) &&
        event.championShipInfo
      ) {
        stream.writeBoolean(true); // chronosTextEntry
        stream.writeString(event.championShipInfo.chronosTextEntry);
        stream.writeVInt(0);
      } else {
        stream.writeBoolean(false);
      }

      stream.writeBoolean(false);
      stream.writeBoolean(false);

      if ([20, 21, 22, 23, 24].includes(event.slot) && event.championShipInfo) {
        stream.writeBoolean(true); // LogicGemOffer
        const offer = event.championShipInfo.logicGemOffer;
        stream.writeVInt(offer.id);
        stream.writeVInt(offer.amount);
        stream.writeDataReference(offer.csvID[0], offer.csvID[1]);
        stream.writeVInt(offer.skinID);
      } else {
        stream.writeBoolean(false);
      }

      stream.writeVInt(1);
      stream.writeVInt(6);

      if (
        [20, 21, 22, 23, 24, 35, 36].includes(event.slot) &&
        event.championShipInfo
      ) {
        stream.writeBoolean(true); // ChronosFileEntry
        const entry = event.championShipInfo.chronosFileEntry;
        stream.writeString(entry.scName);
        stream.writeString(entry.scFile);
      }

      stream.writeBoolean(false); // ChoronosFileEntry::encode
      stream.writeBoolean(false);
      stream.writeVInt(-1);
      stream.writeVInt(0);
      stream.writeVInt(0);
      stream.writeVInt(0);
      stream.writeBoolean(false);
      stream.writeBoolean(false);
      stream.writeBoolean(false);
      stream.writeBoolean(false);
    }

    stream.writeVInt(0);

    const brawlerUpgradeCost = [
      20, 35, 75, 140, 290, 480, 800, 1250, 1875, 2800,
    ];
    const shopCoinsPrice = [20, 50, 140, 280];
    const shopCoinsAmount = [300, 880, 2040, 4680];

    stream.writeVInt(brawlerUpgradeCost.length);
    for (const cost of brawlerUpgradeCost) {
      stream.writeVInt(cost);
    }
    stream.writeVInt(shopCoinsPrice.length);
    for (const price of shopCoinsPrice) {
      stream.writeVInt(price);
    }
    stream.writeVInt(shopCoinsAmount.length);
    for (const amount of shopCoinsAmount) {
      stream.writeVInt(amount);
    }

    stream.writeVInt(0);

    // int value entry
    stream.writeVInt(6);
    stream.writeDataReference(41000117, 1); // theme id
    stream.writeDataReference(89, 6);
    stream.writeDataReference(22, 0);
    stream.writeDataReference(36, 1);
    stream.writeDataReference(73, 1);
    stream.writeDataReference(16, 5);

    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);

    stream.writeVInt(1);
    stream.writeVInt(1);
    stream.writeBoolean(true);
    stream.writeString("1a1d6744f7dfb7bcfa54e3876c944b1da9d075db");
    stream.writeString(
      "/3f8dc547-1aed-4d85-81b0-32ead16f7474_collab_toystory.sc",
    );
    stream.writeVInt(83);
    stream.writeVInt(6);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);

    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);

    // logicconfdata end

    stream.writeLong(player.id[0], player.id[1]);

    stream.writeVInt(0); // notification count

    stream.writeVInt(1);
    stream.writeBoolean(false);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeVInt(0);

    stream.writeBoolean(true); // starr road

    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(1); // todo: unlocking brawler
    stream.writeDataReference(16, 0);
    stream.writeVInt(2); // credits needed
    stream.writeVInt(10000); // gem unlock price
    stream.writeVInt(0);
    stream.writeVInt(1); // current credits
    stream.writeVInt(0);
    stream.writeVInt(0);

    stream.writeVInt(0);

    stream.writeVInt(0);
    stream.writeVInt(0);

    // mastery
    stream.writeVInt(Object.keys(player.ownedBrawlers).length);
    for (const [brawlerID, brawlerData] of Object.entries(
      player.ownedBrawlers,
    )) {
      stream.writeVInt(brawlerData.masteryPoints); // Mastery Points
      stream.writeVInt(brawlerData.masteryClaimed); // Claimed Rewards
      stream.writeDataReference(16, Number(brawlerID)); // Brawler ID
    }

    // battle card
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeBoolean(false);

    stream.writeVInt(0); // brawler battle cards

    // starr drop data
    stream.writeVInt(14);
    for (let i = 0; i < 14; i++) {
      stream.writeDataReference(80, i);
      stream.writeVInt(-1);
      stream.writeVInt(0);
    }
    stream.writeVInt(0);
    stream.writeInt(-1435281534);
    stream.writeVInt(0); // progression step in battles
    stream.writeVInt(0);
    stream.writeVInt(86400 * 24);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeBoolean(false);

    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeVInt(0);
    stream.writeBoolean(false);

    // end LogicClientHome

    stream.writeVLong(player.id[0], player.id[1]);
    stream.writeVLong(player.id[0], player.id[1]);
    stream.writeVLong(player.id[0], player.id[1]);
    stream.writeString(config.name);
    stream.writeBoolean(config.registered);
    stream.writeInt(-1);

    stream.writeVInt(24);
    const unlockedBrawler = Object.values(player.ownedBrawlers).map(
      (i) => i.cardID,
    );
    stream.writeVInt(unlockedBrawler.length + 3);
    for (const x of unlockedBrawler) {
      stream.writeDataReference(23, x);
      stream.writeVInt(-1);
      stream.writeVInt(1);
    }

    stream.writeDataReference(5, 8);
    stream.writeVInt(-1);
    stream.writeVInt(player.coins);

    stream.writeDataReference(5, 21);
    stream.writeVInt(-1);
    stream.writeVInt(0); // todo star road

    stream.writeDataReference(5, 23);
    stream.writeVInt(-1);
    stream.writeVInt(player.bling);

    stream.writeVInt(Object.keys(player.ownedBrawlers).length);
    for (const [brawlerID, brawlerData] of Object.entries(
      player.ownedBrawlers,
    )) {
      stream.writeDataReference(16, Number(brawlerID));
      stream.writeVInt(-1);
      stream.writeVInt(brawlerData.trophies);
    }

    stream.writeVInt(Object.keys(player.ownedBrawlers).length);
    for (const [brawlerID, brawlerData] of Object.entries(
      player.ownedBrawlers,
    )) {
      stream.writeDataReference(16, Number(brawlerID));
      stream.writeVInt(-1);
      stream.writeVInt(brawlerData.highestTrophies);
    }

    stream.writeVInt(0);

    stream.writeVInt(0); // hero power

    stream.writeVInt(Object.keys(player.ownedBrawlers).length);
    for (const [brawlerID, brawlerData] of Object.entries(
      player.ownedBrawlers,
    )) {
      stream.writeDataReference(16, Number(brawlerID));
      stream.writeVInt(-1);
      stream.writeVInt(brawlerData.powerlevel - 1);
    }

    stream.writeVInt(0); // hero star power gadget and hyper

    stream.writeVInt(Object.keys(player.ownedBrawlers).length);
    for (const [brawlerID, brawlerData] of Object.entries(
      player.ownedBrawlers,
    )) {
      stream.writeDataReference(16, Number(brawlerID));
      stream.writeVInt(-1);
      stream.writeVInt(brawlerData.state);
    }

    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);

    stream.writeVInt(player.gems); // Diamonds
    stream.writeVInt(player.gems); // Free Diamonds
    stream.writeVInt(player.level); // Player Level
    stream.writeVInt(100);
    stream.writeVInt(0); // CumulativePurchasedDiamonds / Level Tier
    stream.writeVInt(100); // Battle Count
    stream.writeVInt(10); // WinCount
    stream.writeVInt(80); // LoseCount
    stream.writeVInt(50); // WinLoseStreak
    stream.writeVInt(20); // NpcWinCount
    stream.writeVInt(0); // NpcLoseCount
    stream.writeVInt(config.tutorial ? 0 : 2); // TutorialState
    stream.writeVInt(12);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeString("");
    stream.writeVInt(0);
    stream.writeVInt(0);

    return stream.payload;
  }
}
