import { ByteStream } from "./bytestream.js";
import { LogicSetPlayerNameColorCommand } from "./commands/client/LogicSetPlayerNameColorCommand.js";
import { LogicSetPlayerThumbnailCommand } from "./commands/client/LogicSetPlayerThumbnailCommand.js";

export class CommandHandler {
  static handleCommand(id: number, stream: ByteStream): ByteStream {
    switch (id) {
      case 527:
        stream = LogicSetPlayerNameColorCommand.decodeAndExecute(stream);
        break;
      case 505:
        stream = LogicSetPlayerThumbnailCommand.decodeAndExecute(stream);
        break;
      default:
        console.log("Unhandled command of type:", id);
        break;
    }
    return stream;
  }
}
