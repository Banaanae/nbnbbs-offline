#!/usr/bin/bash
npm run build
ts-node main.ts --host 127.0.0.1:27042 --name Gadget
