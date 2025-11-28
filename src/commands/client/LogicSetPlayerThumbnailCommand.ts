import { ByteStream } from "../../bytestream.js";
import { writeConfig } from "../../config.js";
import { config } from "../../definitions.js";
import { LogicCommand } from "../../logiccommand.js";

export class LogicSetPlayerThumbnailCommand {
  static decodeAndExecute(stream: ByteStream): ByteStream {
    stream = LogicCommand.decode(stream);
    let thumbnailID = stream.readDataReference().low;
    console.log("New thumbnail id:", thumbnailID);
    config.thumbnail = thumbnailID;
    writeConfig(config);
    return stream;
  }
}
