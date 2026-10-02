import { cp, mkdir, rm } from "node:fs/promises";

const destination = "android/app/src/main/assets/www";

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp("dist", destination, { recursive: true });
console.log(`Copied the web build to ${destination}`);
