import { ByteStream } from "../../bytestream.js";
import { writeConfig } from "../../config.js";
import { config } from "../../definitions.js";
import { LogicCommand } from "../../logiccommand.js";

export class LogicSetPlayerThumbnailCommand {
  static decode(stream: ByteStream): any {
    stream = LogicCommand.decode(stream);
    let thumbnail = stream.readDataReference().low;
    return { stream, thumbnail };
  }

  static execute(thumbnailID: number) {
    console.log("New thumbnail id:", thumbnailID);
    config.thumbnail = thumbnailID;
    writeConfig(config);
  }
}
