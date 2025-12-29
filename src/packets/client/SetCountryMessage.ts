import { ByteStream } from "../../bytestream.js";
import { Messaging } from "../../messaging.js";
import { config, player } from "../../definitions.js";
import { writeConfig } from "../../config.js";
import { Logger } from "../../utility/logger.js";
import { Long } from "src/long.js";
import { SetCountryResponseMessage } from "../server/SetCountryResponseMessage.js";

export class SetCountryMessage {
  static decode(stream: ByteStream): Long {
    return stream.readDataReference();
  }

  static execute(region: Long): void {
    Logger.verbose("Changed country to", region.low)
    Messaging.sendOfflineMessage(24178, SetCountryResponseMessage.encode(region))
  }
}
