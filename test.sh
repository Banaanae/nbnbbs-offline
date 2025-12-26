#!/usr/bin/bash
PKG=com.natesworks.nbsoffline.lightyear
npm run build
npx ts-node main.ts -n $PKG -P android
