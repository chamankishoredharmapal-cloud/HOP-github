import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".svg"]);
export const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".mov"]);
export const IGNORED_EXTENSIONS = new Set([
  ".md", ".mdx", ".json", ".yaml", ".yml", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".css", ".txt", ".html", ".xml", ".lock", ".otf", ".woff", ".woff2", ".ttf"
]);

export function calculateHash(filePath) {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export function classifyAsset(relPath, filename) {
  const lowerPath = relPath.toLowerCase();
  const lowerName = filename.toLowerCase();

  if (VIDEO_EXTENSIONS.has(path.extname(lowerName))) {
    return "video";
  }

  if (
    lowerPath.includes("src/content/products") ||
    lowerPath.includes("/product/") ||
    lowerName.includes("product") ||
    lowerName.includes("earring") ||
    lowerName.includes("bracelet")
  ) {
    return "product";
  }

  if (
    lowerPath.includes("src/content/collections") ||
    lowerPath.includes("/lookbook/") ||
    lowerName.includes("collection")
  ) {
    return "collection";
  }

  if (
    lowerPath.includes("src/content/journal") ||
    lowerPath.includes("src/content/craft-notes") ||
    lowerPath.includes("src/content/field-notes") ||
    lowerPath.includes("src/content/house-letters") ||
    lowerPath.includes("src/content/weaver-portraits") ||
    lowerName.includes("fabric") ||
    lowerName.includes("craft")
  ) {
    return "editorial";
  }

  if (lowerName.includes("hero") || lowerName.includes("brand-board") || lowerPath.includes("/hero.jpg") || lowerPath.includes("/hero.png")) {
    return "hero";
  }

  return "general";
}

export function discoverMedia(rootDir = ".") {
  const sourceRoots = ["src/assets", "public", "src/content"];
  const discovered = [];
  const ignored = [];
  const errors = [];

  for (const root of sourceRoots) {
    const absoluteRoot = path.resolve(rootDir, root);
    if (!fs.existsSync(absoluteRoot)) continue;

    function walkDir(currentDir) {
      let entries = [];
      try {
        entries = fs.readdirSync(currentDir, { withFileTypes: true });
      } catch (err) {
        errors.push({ path: currentDir, error: err.message });
        return;
      }

      for (const entry of entries) {
        if (entry.name.startsWith(".")) continue; // Skip hidden files/dirs

        const fullPath = path.join(currentDir, entry.name);
        const relPath = path.relative(rootDir, fullPath).replace(/\\/g, "/");

        if (entry.isDirectory()) {
          walkDir(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (IMAGE_EXTENSIONS.has(ext) || VIDEO_EXTENSIONS.has(ext)) {
            try {
              const stat = fs.statSync(fullPath);
              const hash = calculateHash(fullPath);
              const profile = classifyAsset(relPath, entry.name);
              discovered.push({
                fullPath,
                relPath,
                filename: entry.name,
                extension: ext,
                type: VIDEO_EXTENSIONS.has(ext) ? "video" : "image",
                sizeBytes: stat.size,
                hash,
                profile,
              });
            } catch (err) {
              errors.push({ path: fullPath, error: err.message });
            }
          } else {
            ignored.push({ relPath, extension: ext });
          }
        }
      }
    }

    walkDir(absoluteRoot);
  }

  return { discovered, ignored, errors };
}
