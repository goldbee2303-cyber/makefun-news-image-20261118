// Copies entry.png (shipped beside this program) to
// MAKEFUN_OUTPUT_DIR/entry.png and verifies the copy is byte-identical.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outDir, "entry.png");

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);

const a = readFileSync(source);
const b = readFileSync(target);
if (a.length !== b.length || !a.equals(b)) {
  throw new Error("entry.png copy differs from source");
}
const pngMagic = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
if (!pngMagic.every((v, i) => b[i] === v)) {
  throw new Error("entry.png is not a PNG");
}
if (b.length > 1048576) {
  throw new Error("entry.png exceeds 1 MiB");
}
console.log(`wrote ${target} (${b.length} bytes, byte-identical to source)`);
