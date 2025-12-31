import { createAssetManager } from "./utility/assetmanagerandroid.js";
import { base, config, load, setBase } from "./definitions.js";
import { installHooks } from "./mainHooks.js";
import { isAndroid } from "./platform.js";
import { Logger } from "./utility/logger.js";
import { setupCustomSettings } from "./customsettings.js";

(async () => {
  if (isAndroid) await createAssetManager();
  let library = isAndroid ? "libg.so" : "laser";
  setBase(Module.getBaseAddress(library));

  load();
  Logger.info("Running on", isAndroid ? "Android" : "iOS");
  Logger.verbose(`${library} loaded at: ${base}`);
  for (const brawlerKey in config.ownedBrawlers) {
    const brawler = config.ownedBrawlers[brawlerKey];
    for (const skin of brawler.skins) {
      config.ownedSkins.push(skin);
    }
  }
  installHooks();
  if (config.customSettings) setupCustomSettings();
})();
