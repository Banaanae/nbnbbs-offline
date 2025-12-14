import { ByteStream } from "../../bytestream.js";
import { writeConfig } from "../../config.js";
import { config } from "../../definitions.js";
import { LogicCommand } from "../../logiccommand.js";
import { Logger } from "../../utility/logger.js";

export class LogicSelectSkinCommand {
  static decode(stream: ByteStream): any {
    stream = LogicCommand.decode(stream);
    let skin = stream.readDataReference().low;
    console.log("New skin id:", skin);
    let unk1 = stream.readVint();
    return { stream, skin };
  }

  static execute(skinID: number) {
    Logger.verbose("New skin id:", skinID);
    // todo
  }
}
