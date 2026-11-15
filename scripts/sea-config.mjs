// Writes the Node SEA config for `make exe`: every file in dist/client becomes
// an asset keyed by its URL path (e.g. "/assets/index-abc.js").
import { readdirSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const [clientDir, main, blob, out] = process.argv.slice(2);

const assets = {};
for (const entry of readdirSync(clientDir, { recursive: true, withFileTypes: true })) {
  if (!entry.isFile()) continue;
  const file = join(entry.parentPath, entry.name);
  assets["/" + relative(clientDir, file).split(sep).join("/")] = file;
}

writeFileSync(
  out,
  JSON.stringify(
    {
      main,
      output: blob,
      disableExperimentalSEAWarning: true,
      useSnapshot: false,
      useCodeCache: false, // code cache is platform-specific; we build on Linux for Windows
      assets,
    },
    null,
    2,
  ),
);
