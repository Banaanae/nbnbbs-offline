// This is a simple tool to dump structure

import { base } from "../definitions";
import { GlobalID } from "../globalid";
import { Offsets } from "../offsets";
import { decodeString } from "../util";
import { Logger } from "./logger";

export class Dumper {
  // hooks
  writeDataReference: InvocationListener | undefined = undefined;
  writeVInt: InvocationListener | undefined = undefined;
  writeInt: InvocationListener | undefined = undefined;
  writeBoolean: InvocationListener | undefined = undefined;
  writeLongLong: InvocationListener | undefined = undefined;
  writeString: InvocationListener | undefined = undefined;

  isWritingElseWhere = false;

  id = 0;

  /**
   * @param offset Offset of the encode function
   */
  dump(name: string, offset: number) {
    const addr = base.add(offset);
    const self = this;
    Interceptor.attach(addr, {
      onEnter() {
        self.hookWrites(name);
      },
      onLeave() {
        self.detachWrites();
        self.id++;
      },
    });
  }

  hookWrites(name: string) {
    const self = this;

    this.writeDataReference = Interceptor.attach(
      base.add(Offsets.WriteDataReference),
      {
        onEnter(args) {
          if (self.isWritingElseWhere) {
            this.disable = true;
            return;
          }
          if (args[1].isNull()) {
            let message = "stream.writeVInt(0);";

            send({
              type: "dump",
              name: name,
              data: message,
              id: self.id,
            });
          } else {
            const globalID = args[1].add(Offsets.GlobalID).readInt();
            //const classID = GlobalID.getClassID(globalID);
            //const instanceID = GlobalID.getInstanceID(globalID);
            let message = "stream.writeDataReference(" + globalID + ");";
            send({
              type: "dump",
              name: name,
              data: message,
              id: self.id,
            });
          }
        },
        onLeave() {
          if (!this.disable) {
            self.isWritingElseWhere = false;
          } else {
            return;
          }
        },
      },
    );
    this.writeVInt = Interceptor.attach(base.add(Offsets.WriteVInt), {
      onEnter(args) {
        if (self.isWritingElseWhere) {
          this.disable = true;
          return;
        }

        let message = "stream.writeVInt(" + args[1].toInt32() + ");";
        send({
          type: "dump",
          name: name,
          data: message,
          id: self.id,
        });
      },
      onLeave() {
        if (!this.disable) {
          self.isWritingElseWhere = false;
        } else {
          return;
        }
      },
    });

    this.writeBoolean = Interceptor.attach(base.add(Offsets.WriteBoolean), {
      onEnter(args) {
        if (self.isWritingElseWhere) {
          this.disable = true;
          return;
        }

        let message =
          "stream.writeBoolean(" + Boolean(args[1].toInt32()) + ");";
        send({
          type: "dump",
          name: name,
          data: message,
          id: self.id,
        });
      },
      onLeave() {
        if (!this.disable) {
          self.isWritingElseWhere = false;
        } else {
          return;
        }
      },
    });

    /*
    this.writeLongLong = Interceptor.attach(base.add(Offsets.WriteLongLong), {
      onEnter(args) {
        if (self.isWritingElseWhere) {
          this.disable = true;
          return;
        }
        Logger.info("WriteLongLong", args[1].toInt32());
      },
      onLeave() {
        if (!this.disable) {
          self.isWritingElseWhere = false;
        } else {
          return;
        }
      },
    });
    */

    this.writeString = Interceptor.attach(base.add(Offsets.WriteString), {
      onEnter(args) {
        if (self.isWritingElseWhere) {
          this.disable = true;
          return;
        }

        let message = 'stream.writeString("' + decodeString(args[1]) + '");';
        send({
          type: "dump",
          name: name,
          data: message,
          id: self.id,
        });
      },
      onLeave() {
        if (!this.disable) {
          self.isWritingElseWhere = false;
        } else {
          return;
        }
      },
    });
  }

  detachWrites() {
    this.writeDataReference?.detach();
    this.writeVInt?.detach();
    this.writeBoolean?.detach();
    this.writeLongLong?.detach();
    this.writeString?.detach();
  }
}
