// chatgpt'd runner script sob

import * as frida from "frida";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

type Args = {
  host?: string;
  pid?: string;
  name?: string;
};

const trackers = new Map();

function parseArgs(): Args {
  const args = process.argv.slice(2);
  const out: Args = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--host" || a === "-H") out.host = args[++i];
    else if (a === "--pid" || a === "-p") out.pid = args[++i];
    else if (a === "--name" || a === "-n") out.name = args[++i];
  }
  return out;
}

async function main() {
  const args = parseArgs();
  const device = args.host
    ? await frida.getDeviceManager().addRemoteDevice(args.host)
    : await frida.getLocalDevice();

  let target: string | number | undefined = args.pid ?? args.name;
  if (!target) throw new Error("missing --pid or --name");

  if (args.name && !args.pid) {
    try {
      const out = execSync(`adb shell pidof ${args.name}`, {
        encoding: "utf8",
      }).trim();
      if (out) target = out.split(/\s+/)[0];
    } catch {}
  }

  const session = await device.attach(target);
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
  console.log("attached and listening");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
