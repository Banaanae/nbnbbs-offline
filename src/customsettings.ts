import {
  base,
  config,
  getFontSize,
  getHeight,
  getTextFieldByName,
  getWidth,
  getX,
  getY,
  setXY,
} from "./definitions";
import { Offsets } from "./offsets";
import { Logger } from "./utility/logger";
import { UI } from "./utility/ui";

let editControlsPos: any;
let editConfigPos: any;
let guiContainer: NativePointer;

export function setupCustomSettings() {
  Interceptor.attach(base.add(Offsets.SettingsScreenConstructor), {
    onEnter(args) {
      guiContainer = args[0];
      this.addGameBtnHook = Interceptor.attach(
        base.add(Offsets.AddGameButton),
        {
          onEnter(args) {
            this.name = args[1].readCString();
            //Logger.verbose("Adding button with name", this.name);
          },
          onLeave(btn) {
            if (this.name == "button_parentsguide") {
              editControlsPos = { x: getX(btn), y: getY(btn) };
            } else if (this.name == "button_edit_controls") {
              setXY(btn, editControlsPos.x, editControlsPos.y);
            } else if (this.name == "button_random_reward_rates") {
              editConfigPos = { x: getX(btn), y: getY(btn) };
            }
            if (config.hiddenSettingsButtons.includes(this.name)) {
              UI.hide(btn);
            }
          },
        },
      );
    },
    onLeave() {
      this.addGameBtnHook.detach();
      let btn = UI.createButton(
        guiContainer,
        "sc/ui.sc",
        "country_item",
        true,
        editConfigPos.x,
        editConfigPos.y,
        180,
        90,
        1,
      );
      UI.setButtonText(btn, "Text", "Edit configuration", true, true, 22);
    },
  });
}
