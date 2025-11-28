import { Player } from "../../player.js";
import { ByteStream } from "../../bytestream.js";
import { CommandHandler } from "../../commandhandler.js";

export class EndClientTurnMessage {
  // im lazy
  static decodeAndExecute(player: Player, stream: ByteStream) {
    stream.readBoolean();
    stream.readVint();
    stream.readVint();
    let count = stream.readVint();
    console.log("Command amount:", count);
    for (let i = 0; i < count; i++) {
      let id = stream.readVint();
      console.log("Command ID:", id);
      stream = CommandHandler.handleCommand(id, stream);
    }
  }
}
