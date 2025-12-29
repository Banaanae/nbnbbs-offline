import { config, player } from "../../definitions.js";
import { ByteStream } from "../../bytestream.js";
import { Player } from "../../player.js";
import { Long } from "src/long.js";

export class SetCountryResponseMessage {
  static encode(country: Long): number[] {
    let stream = new ByteStream([]);

    stream.writeVInt(0);
    stream.writeDataReference(country.high, country.low)

    return stream.payload;
  }
}
