import { setText } from "./definitions";
import { Logger } from "./utility/logger";
import { UI } from "./utility/ui";

export class DebugMenu {
  guiContainer: NativePointer;
  toggle: NativePointer = NULL;
  menu: NativePointer = NULL;

  constructor(guiContainer: NativePointer) {
    this.guiContainer = guiContainer;
    this.createDebugButton();
  }
  createDebugButton() {
    Logger.debug("Creating debug button");
    this.toggle = UI.createButton(
      this.guiContainer,
      "sc/debug.sc",
      "debug_button",
      true,
      -40,
      575,
    );
    UI.setButtonText(this.toggle, "txt", "D");
  }

  createDebugMenu() {
    Logger.debug("Creating debug menu");
    this.menu = UI.createButton(
      this.guiContainer,
      "sc/debug.sc",
      "debug_menu",
      false,
      250, // good is 1200; left 250
      0,
    );
    //UI.setButtonText(this.menu, "item_area", "Test");
    //UI.setButtonText(this.menu, "tab_area", "Test");
    UI.setButtonText(this.menu, "version", "Beta 4 Testing");
    UI.setButtonText(this.menu, "search_help", "Search...");
    UI.setButtonText(this.menu, "title", "NBS Offline");
    //UI.setButtonText(this.menu, "filter_input", "lol");
    let test = UI.createButton(
      this.menu,
      "sc/debug.sc",
      "debug_menu_item",
      true,
      -150,
      100,
    );
    UI.setButtonText(test, "Text", "Hello", false, true);
  }
}
