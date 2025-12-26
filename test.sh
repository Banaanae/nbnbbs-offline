#!/usr/bin/bash
adb forward tcp:27042 tcp:27042
npm run build
ts-node main.ts
