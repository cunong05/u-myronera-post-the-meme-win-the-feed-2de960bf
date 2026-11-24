// Post the Meme, Win the Feed — make.fun bounty entry
// Copies POST.json from the repo root to the make.fun output dir.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

try {
  // Validate POST.json before copying: it must parse as JSON with a url string.
  const post = JSON.parse(readFileSync(join(botDir, "POST.json"), "utf8"));
  if (typeof post.url !== "string" || post.url.length === 0) {
    throw new Error("POST.json is missing a non-empty \"url\" string");
  }
  if (/\/status\/0+$/.test(post.url)) {
    throw new Error("POST.json still holds the placeholder URL — replace it with the real X post URL before submitting");
  }
  mkdirSync(outputDir, { recursive: true });
  copyFileSync(join(botDir, "POST.json"), join(outputDir, "POST.json"));
  // Verify the copied bytes match the source byte-for-byte.
  const copied = readFileSync(join(outputDir, "POST.json"));
  const source = readFileSync(join(botDir, "POST.json"));
  if (!copied.equals(source)) {
    throw new Error("Copied POST.json bytes differ from source POST.json");
  }
  console.log(`Copied POST.json to ${join(outputDir, "POST.json")}`);
} catch (err) {
  const detail = err instanceof Error ? err.message : String(err);
  console.error(
    `Failed to publish POST.json (from ${join(botDir, "POST.json")} to ${join(outputDir, "POST.json")}): ${detail}`
  );
  process.exit(1);
}
