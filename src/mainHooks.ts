import { Offsets } from "./offsets.js";
import { PiranhaMessage } from "./piranhamessage.js";
import {
  base,
  botNames,
  buttonHandlers,
  config,
  loadAsset,
  setBotNames,
  setTextAndScaleIfNecessary,
} from "./definitions.js";
import { Messaging } from "./messaging.js";
import {
  backtrace,
  createStringObject,
  decodeString,
  getBotNames,
} from "./util.js";
import { ByteStream } from "./bytestream.js";
import { isAndroid } from "./platform.js";
import { Logger } from "./utility/logger.js";
import { DebugMenu } from "./debugmenu.js";

let progress: number;
let hasLoaded = false;
let firstTime = false;

export function installHooks() {
  Interceptor.attach(base.add(Offsets.DebuggerError), {
    onEnter(args) {
      Logger.error(args[0].readCString());
    },
  });

  Interceptor.attach(base.add(Offsets.DebuggerWarning), {
    onEnter(args) {
      Logger.warn(decodeString(args[0]));
    },
  });

  Interceptor.attach(base.add(Offsets.ServerConnectionUpdate), {
    onEnter: function (args) {
      if (args[0].readS32() == 0 && hasLoaded && firstTime) {
        Logger.debug("Resuming from updater"); // TODO: rework this trash
        args[0].writeS32(1);
        firstTime = false;
      }
      args[0]
        .add(Process.pointerSize)
        .readPointer()
        .add(Offsets.HasConnectFailed)
        .writeU8(0);
      args[0]
        .add(Process.pointerSize)
        .readPointer()
        .add(Offsets.State)
        .writeInt(5);
    },
  });

  Interceptor.attach(base.add(Offsets.IsDev), {
    onLeave(retval) {
      retval.replace(ptr(1));
    },
  });

  Interceptor.attach(base.add(Offsets.IsDeveloperBuild), {
    onLeave(retval) {
      retval.replace(ptr(1));
    },
  });

  Interceptor.attach(base.add(Offsets.IsProd), {
    onLeave(retval) {
      retval.replace(ptr(0));
    },
  });

  Interceptor.attach(base.add(Offsets.MessageManagerReceiveMessage), {
    onLeave: function (retval) {
      retval.replace(ptr(1));
    },
  });

  Interceptor.attach(base.add(Offsets.StartGame), {
    onEnter: function (args) {
      args[3] = ptr(3);
      if (config.randomBotNames) {
        this.h = Interceptor.attach(base.add(Offsets.GetPlayerCount), {
          onLeave(retval) {
            setBotNames(getBotNames(retval.toInt32() - 1));
            Logger.verbose("Bot names:", botNames.toString());
          },
        });
      }
    },
    onLeave() {
      if (config.randomBotNames) {
        this.h.detach();
      }
    },
  });

  Interceptor.attach(base.add(Offsets.SendMessage), {
    onEnter(args) {
      PiranhaMessage.encode(args[1]);
      let messaging = args[0].add(Offsets.Messaging).readPointer();
      messaging.add(Offsets.State).writeInt(5);
    },
  });

  /*
  Interceptor.replace(
    base.add(Offsets.SendKeepAliveMessage),
    new NativeCallback(function () {}, "void", []),
  );
  */

  Interceptor.replace(
    base.add(Offsets.Send),
    new NativeCallback(
      function (_self, message) {
        let type = PiranhaMessage.getMessageType(message);
        let length = PiranhaMessage.getEncodingLength(message);

        if (type === 10108) return 0;
        Logger.info("Recieved message of type:", type);
        Logger.verbose("Length:", length);
        let payloadPtr = PiranhaMessage.getByteStream(message)
          .add(Offsets.PayloadPtr)
          .readPointer();
        let payload = payloadPtr.readByteArray(length);
        if (payload !== null) {
          let stream = new ByteStream(Array.from(new Uint8Array(payload)));
          Logger.debug("Stream dump:", payload);
          Messaging.handleMessage(type, stream);
        }

        PiranhaMessage.destroyMessage(message);

        return 0;
      },
      "int",
      ["pointer", "pointer"],
    ),
  );

  // idk couldnt find on android
  /*
  Interceptor.attach(base.add(Offsets.ShouldShowChatButton), {
    onLeave(retval) {
      retval.replace(ptr(1)); // todo cfg opt
    },
  });
  */

  Interceptor.attach(base.add(Offsets.GetHelpfulHandState), {
    onLeave(retval) {
      retval.replace(ptr(-1));
    },
  });

  Interceptor.attach(base.add(Offsets.UpdateLoadingProgress), {
    onEnter(args) {
      this.textfield = args[0].add(Offsets.LoadingText).readPointer();
      this.goToAndStopFrameIndexHook = Interceptor.attach(
        base.add(Offsets.GotoAndStopFrameIndex),
        {
          onEnter(args) {
            progress = args[1].toInt32();
            if (progress == 99) hasLoaded = true;
          },
        },
      );
    },
    onLeave(retval) {
      if (config.customLoadingScreen) {
        let text = `[${progress}%] Loading game...`;
        setTextAndScaleIfNecessary(
          this.textfield,
          createStringObject(text),
          0,
          0,
        );
        this.goToAndStopFrameIndexHook.detach();
      }
    },
  });

  // TODO: Remove this
  if (isAndroid && Process.arch == "arm64") {
    Interceptor.attach(base.add(Offsets.InitStateUpdateLoading), {
      onEnter() {
        const dlmgrinst = base
          .add(Offsets.DownloadManagerInstance)
          .readPointer();
        dlmgrinst.add(Offsets.Unk1).writeS32(6);
      },
    });

    Interceptor.replace(
      base.add(Offsets.UpdateChronosResources),
      new NativeCallback(function () {}, "void", []),
    );
  }

  Interceptor.attach(base.add(Offsets.StringTableGetString), {
    onEnter(args) {
      this.str = args[0].readUtf8String();
    },
    onLeave(retval) {
      let replacement;
      if (config.randomBotNames && this.str.startsWith("TID_BOT_")) {
        let idx = this.str.split("TID_BOT_")[1] - 1;
        replacement = botNames[idx];
      }
      if (replacement) retval.replace(createStringObject(replacement));
    },
  });

  Interceptor.replace(
    base.add(Offsets.GetPlayerDraftMapNumLimit),
    new NativeCallback(
      () => {
        return config.draftMapLimit;
      },
      "int",
      [],
    ),
  );

  Interceptor.attach(base.add(Offsets.IsSupercellIDEnabled), {
    onLeave(retval) {
      retval.replace(ptr(0));
    },
  });

  Interceptor.attach(base.add(Offsets.HomePageConstructor), {
    onLeave(guiContainer) {
      Logger.debug(
        "Load asset retval",
        loadAsset(createStringObject("sc/debug.sc"), 0),
      );
      new DebugMenu(guiContainer).createDebugMenu();
    },
  });

  Interceptor.attach(base.add(Offsets.ButtonPressed), {
    onEnter(args) {
      const clicked = args[0];

      for (const entry of buttonHandlers) {
        if (entry.ptr.equals(clicked)) {
          entry.handler(clicked);
          break;
        }
      }
    },
  });
}
