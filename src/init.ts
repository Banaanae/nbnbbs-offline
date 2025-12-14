import { createAssetManager } from "./utility/assetmanagerandroid.js";
import { base, load, player, setBase } from "./definitions.js";
import { installHooks } from "./mainHooks.js";
import { isAndroid } from "./platform.js";
import { Logger } from "./utility/logger.js";
import { Dumper } from "./utility/dump.js";

(async () => {
  if (isAndroid) await createAssetManager();
  setImmediate(() => {
    let library = isAndroid ? "libg.so" : "laser";
    setBase(Module.getBaseAddress(library));

    load();
    Logger.info("Running on", isAndroid ? "Android" : "iOS");
    Logger.verbose(`${library} loaded at: ${base}`);
    for (const brawlerKey in player.ownedBrawlers) {
      const brawler = player.ownedBrawlers[brawlerKey];
      for (const skin of brawler.skins) {
        player.ownedSkins.push(skin);
      }
    }
    installHooks();
    if (!isAndroid) {
      let dumper = new Dumper();
      dumper.dump("eventdata", 0x3fc9e4);
    }
  });
})();
