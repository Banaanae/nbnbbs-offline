import * as frida from "frida";
import fs from "fs";
import path from "path";

const trackers = new Map();

async function main() {
  const device = await frida
    .getDeviceManager()
    .addRemoteDevice("127.0.0.1:27042");
  const session = await device.attach("Gadget");

  const source = fs.readFileSync("script.js", "utf8");
  const script = await session.createScript(source);

  script.message.connect((message, data) => {
    if (message.type !== "send") return;
    const p = message.payload as any;
    if (!p || p.type !== "dump") return;

    const name = p.name as string;
    const id = p.id;
    if (typeof id === "undefined") return;

    const key = `${name}_${id}`;
    const nameDir = path.join("dumps", name);
    fs.mkdirSync(nameDir, { recursive: true });

    let file;
    let isAppend = false;

    if (trackers.has(key)) {
      file = trackers.get(key);
      isAppend = true;
    } else {
      let maxNum = -1;
      const files = fs.readdirSync(nameDir);
      const nums = files.filter((f) => /^\d+$/.test(f)).map((f) => parseInt(f));
      if (nums.length > 0) {
        maxNum = Math.max(...nums);
      }
      const nextNum = maxNum + 1;
      file = path.join(nameDir, nextNum.toString());
      trackers.set(key, file);
    }

    let content;
    if (data && data.byteLength) {
      content = Buffer.from(data);
    } else if (typeof p.data === "string") {
      content = p.data + "\n";
    } else {
      content = JSON.stringify(p.data) + "\n";
    }

    if (isAppend) {
      fs.appendFileSync(file, content);
    } else {
      fs.writeFileSync(file, content);
    }
  });

  await script.load();
}

main();
