import { ByteStream } from "../../bytestream.js";
import { writeConfig } from "../../config.js";
import { config } from "../../definitions.js";
import { LogicCommand } from "../../logiccommand.js";

export class LogicSetPlayerNameColorCommand {
  static decodeAndExecute(stream: ByteStream): ByteStream {
    stream = LogicCommand.decode(stream);
    let colorID = stream.readDataReference().low;
    console.log("New color id:", colorID);
    config.namecolor = colorID;
    writeConfig(config);
    return stream;
  }
}
