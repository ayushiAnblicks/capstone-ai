import { cpSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const source = path.join(scriptDir, "..", "src", "definitions");
const destination = path.join(scriptDir, "..", "dist", "definitions");

if (existsSync(source)) {
  cpSync(source, destination, { recursive: true });
  console.log("Copied src/definitions -> dist/definitions");
}
