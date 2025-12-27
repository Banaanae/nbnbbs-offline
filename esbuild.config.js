const path = require('path');
const esbuild = require('esbuild');

const args = process.argv.slice(2);
const argMap = {};
args.forEach(arg => {
  const [key, value] = arg.split('=');
  argMap[key.replace(/^--/, '')] = value;
})

const gmv = argMap.gmv
let devicePath = argMap.device === "android" ? "android/arm64" : "ios"

esbuild.build({
  entryPoints: ['src/init.ts'],
  bundle: true,
  outfile: 'script.js',
  plugins: [
    {
      name: 'get-correct-ver',
      setup(build) {
        build.onResolve({ filter: /^version$/ }, args => {
          return {
            path: path.resolve(__dirname, `src/version/v${gmv}/${devicePath}/version.ts`),
            namespace: 'file'
          };
        });
      }
    }
  ]
}).catch(() => process.exit(1));
