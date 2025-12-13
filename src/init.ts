import { createAssetManager } from "./assetmanagerandroid.js";
import { base, load, player, setBase } from "./definitions.js";
import { installHooks } from "./mainHooks.js";
import { isAndroid } from "./platform.js";

(async () => {
  console.log("Hello, world!");
  if (isAndroid) await createAssetManager();
  setImmediate(() => {
    let library = isAndroid ? "libg.so" : "laser";
    setBase(Module.getBaseAddress(library));
    console.log("Running on", isAndroid ? "Android" : "iOS");
    console.log(`${library} loaded at: ${base}`);

    load();
    for (const brawlerKey in player.ownedBrawlers) {
      const brawler = player.ownedBrawlers[brawlerKey];
      for (const skin of brawler.skins) {
        player.ownedSkins.push(skin);
      }
    }
    installHooks();
  });
})();
