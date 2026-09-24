import fs from "node:fs";
import path from "node:path";
import { execa } from "execa";
import { isPathProtected } from "./validate.mjs";
import { processImage } from "./processor.mjs";

export async function probeVideo(videoPath) {
  try {
    const { stdout } = await execa("ffprobe", [
      "-v", "quiet",
      "-print_format", "json",
      "-show_format",
      "-show_streams",
      videoPath,
    ]);
    return JSON.parse(stdout);
  } catch (err) {
    throw new Error(`ffprobe failed for ${videoPath}: ${err.message}`);
  }
}

export async function processVideo(asset, videoProfile, outputRootDir = "output", options = {}) {
  const { dryRun = false } = options;
  const results = [];

  const assetSlug = path.parse(asset.filename).name;
  const videoOutDir = path.join(outputRootDir, "videos", assetSlug);
  const posterOutDir = path.join(outputRootDir, "posters", assetSlug);

  if (isPathProtected(videoOutDir) || isPathProtected(posterOutDir)) {
    throw new Error(`FAIL_PROTECTED_PATH: Target path resolves into a protected source directory!`);
  }

  if (dryRun) {
    return [
      { path: path.join(videoOutDir, `${assetSlug}-1080p.mp4`), format: "mp4", dryRun: true, status: "PLANNED" },
      { path: path.join(posterOutDir, `${assetSlug}-poster.avif`), format: "avif", dryRun: true, status: "PLANNED" },
    ];
  }

  fs.mkdirSync(videoOutDir, { recursive: true });
  fs.mkdirSync(posterOutDir, { recursive: true });

  const probe = await probeVideo(asset.fullPath);
  const videoStream = probe.streams?.find((s) => s.codec_type === "video");
  const sourceWidth = videoStream?.width ?? 1920;

  for (const res of videoProfile.resolutions) {
    if (res.width > sourceWidth) continue; // No-upscaling invariant

    const outMp4 = path.join(videoOutDir, `${assetSlug}-${res.name}.mp4`);
    await execa("ffmpeg", [
      "-y",
      "-i", asset.fullPath,
      "-vf", `scale=w=MIN(${res.width}\\,iw):h=-2`,
      "-c:v", "libx264",
      "-crf", String(res.crf),
      "-preset", "slow",
      "-movflags", "+faststart",
      "-an",
      outMp4,
    ]);

    const stat = fs.statSync(outMp4);
    results.push({
      path: outMp4,
      format: "mp4",
      width: res.width,
      sizeBytes: stat.size,
      validationStatus: "PASS",
    });
  }

  // Poster Extraction
  const rawPosterPath = path.join(posterOutDir, "poster-raw.png");
  await execa("ffmpeg", [
    "-y",
    "-ss", String(videoProfile.posterTimestamp || 0.5),
    "-i", asset.fullPath,
    "-vframes", "1",
    "-q:v", "2",
    rawPosterPath,
  ]);

  if (fs.existsSync(rawPosterPath)) {
    const posterAsset = {
      fullPath: rawPosterPath,
      filename: "poster-raw.png",
      extension: ".png",
      type: "image",
      sizeBytes: fs.statSync(rawPosterPath).size,
      metadata: { width: sourceWidth, height: Math.round(sourceWidth / (16 / 9)) },
    };

    const heroConfig = {
      targetWidths: [1920, 1200],
      formats: videoProfile.posterFormats || ["avif", "webp"],
      quality: { avif: 75, webp: 80 },
    };

    const posterDerivs = await processImage(posterAsset, heroConfig, outputRootDir, options);
    results.push(...posterDerivs);
    fs.unlinkSync(rawPosterPath); // Clean temporary raw frame
  }

  return results;
}
