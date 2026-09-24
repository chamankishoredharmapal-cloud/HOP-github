import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

export function isPathProtected(targetPath, rootDir = ".") {
  const absoluteTarget = path.resolve(rootDir, targetPath);
  const protectedRoots = [
    path.resolve(rootDir, "src/assets"),
    path.resolve(rootDir, "public"),
    path.resolve(rootDir, "src/content"),
  ];

  for (const protectedRoot of protectedRoots) {
    if (absoluteTarget.startsWith(protectedRoot)) {
      return true;
    }
  }
  return false;
}

export async function validateMediaAsset(asset) {
  if (!fs.existsSync(asset.fullPath)) {
    return { status: "FAIL", error: "File does not exist" };
  }

  try {
    const stat = fs.statSync(asset.fullPath);
    if (stat.size === 0) {
      return { status: "FAIL", error: "File is 0 bytes (corrupt/empty)" };
    }

    if (asset.type === "image") {
      if (asset.extension === ".svg") {
        return { status: "PASS", metadata: { width: 0, height: 0, format: "svg" } };
      }
      const buf = fs.readFileSync(asset.fullPath);
      const metadata = await sharp(buf).metadata();
      if (!metadata.width || !metadata.height) {
        return { status: "FAIL", error: "Could not read image dimensions" };
      }
      return {
        status: "PASS",
        metadata: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
          space: metadata.space,
          channels: metadata.channels,
          hasAlpha: metadata.hasAlpha,
        },
      };
    }

    if (asset.type === "video") {
      return { status: "PASS", metadata: { type: "video" } };
    }

    return { status: "FAIL", error: "Unsupported asset type" };
  } catch (err) {
    return { status: "FAIL", error: err.message };
  }
}
