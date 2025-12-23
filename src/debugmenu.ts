import { base, setText, showFloaterText } from "./definitions";
import { Logger } from "./utility/logger";
import { ButtonHelper } from "./utility/buttonhelper";
import { createStringObject } from "./util";
import { Offsets } from "./offsets";

export class DebugMenu {
  guiContainer: NativePointer;
  toggle: NativePointer = NULL;
  menu: NativePointer = NULL;

  constructor(guiContainer: NativePointer) {
    this.guiContainer = guiContainer;
    this.createDebugButton();
    ButtonHelper.setButtonHandler(this.toggle, this.onDebugButtonClick);
  }

  onDebugButtonClick(button: NativePointer) {
    Logger.debug("Button clicked");
    showFloaterText(
      base.add(Offsets.GUIInstance).readPointer(),
      createStringObject("Hello, world!"),
      -1,
      0.0,
    );
  }

  createDebugButton() {
    Logger.debug("Creating debug button");
    this.toggle = ButtonHelper.createButton(
      this.guiContainer,
      "sc/debug.sc",
      "debug_button",
      true,
      -40,
      575,
    );
    ButtonHelper.setButtonText(this.toggle, "txt", "D");
  }

  createDebugMenu() {
    Logger.debug("Creating debug menu");
    this.menu = ButtonHelper.createButton(
      this.guiContainer,
      "sc/debug.sc",
      "debug_menu",
      false,
      1200, // good is 1200; left 250
      0,
    );
    //UI.setButtonText(this.menu, "item_area", "Test");
    //UI.setButtonText(this.menu, "tab_area", "Test");
    ButtonHelper.setButtonText(this.menu, "title", "NBS Offline");
    ButtonHelper.setButtonText(this.menu, "version", "Beta 4 Testing");
    ButtonHelper.setButtonText(this.menu, "search_help", "Search...");

    //UI.setButtonText(this.menu, "filter_input", "lol");
    let test = ButtonHelper.createButton(
      this.menu,
      "sc/debug.sc",
      "debug_menu_item",
      true,
      -150,
      100,
    );
    ButtonHelper.setButtonText(test, "Text", "Hello", false, true);
    ButtonHelper.setButtonHandler(test, this.onDebugButtonClick);
  }
}
