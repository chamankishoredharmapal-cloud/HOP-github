import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { isPathProtected } from "./validate.mjs";
import { calculateSSIM, evaluateSSIMStatus } from "./ssim.mjs";

export async function processImage(asset, profileConfig, outputRootDir = "output", options = {}) {
  const { dryRun = false, forceJpeg = false } = options;
  const results = [];

  if (asset.extension === ".svg" || asset.metadata?.format === "svg") {
    const assetSlug = asset.relPath.replace(/[^a-zA-Z0-9_\-]/g, "_");
    const assetOutDir = path.join(outputRootDir, "images", assetSlug);
    if (isPathProtected(assetOutDir)) {
      throw new Error(`FAIL_PROTECTED_PATH: Target path ${assetOutDir} resolves into a protected source directory!`);
    }
    if (!dryRun) {
      fs.mkdirSync(assetOutDir, { recursive: true });
      const outPath = path.join(assetOutDir, asset.filename);
      fs.copyFileSync(asset.fullPath, outPath);
      const derivBytes = fs.statSync(outPath).size;
      results.push({
        path: outPath,
        format: "svg",
        width: 0,
        height: 0,
        sizeBytes: derivBytes,
        quality: 100,
        sizeRatio: 1.0,
        reductionPercent: 0,
        ssim: 1.0,
        validationStatus: "PASS",
      });
    }
    return results;
  }

  const sourceWidth = asset.metadata.width;
  const sourceHeight = asset.metadata.height;
  const aspectRatio = sourceWidth / sourceHeight;

  const targetWidths = profileConfig.targetWidths.filter((w) => w <= sourceWidth);
  if (!targetWidths.includes(sourceWidth)) {
    targetWidths.push(sourceWidth);
  }
  targetWidths.sort((a, b) => b - a); // Descending order

  const formats = [...profileConfig.formats];
  if ((profileConfig.jpegFallback || forceJpeg) && !formats.includes("jpg")) {
    formats.push("jpg");
  }

  const assetSlug = asset.relPath
    .replace(/[^a-zA-Z0-9_\-]/g, "_");
  const assetOutDir = path.join(outputRootDir, "images", assetSlug);

  if (isPathProtected(assetOutDir)) {
    throw new Error(`FAIL_PROTECTED_PATH: Target path ${assetOutDir} resolves into a protected source directory!`);
  }

  if (!dryRun) {
    fs.mkdirSync(assetOutDir, { recursive: true });
  }

  for (const width of targetWidths) {
    const height = Math.round(width / aspectRatio);

    // Hard Invariant Check
    if (width > sourceWidth || height > sourceHeight) {
      console.warn(`[No-Upscaling Violate Prevented] Skipping ${width}x${height} for source ${sourceWidth}x${sourceHeight}`);
      continue;
    }

    for (const format of formats) {
      const outFilename = `${assetSlug}-${width}w.${format === "jpeg" ? "jpg" : format}`;
      const outPath = path.join(assetOutDir, outFilename);
      const quality = profileConfig.quality[format] ?? 80;

      if (dryRun) {
        results.push({
          path: outPath,
          format,
          width,
          height,
          quality,
          dryRun: true,
          status: "PLANNED",
        });
        continue;
      }

      const sourceBuffer = fs.readFileSync(asset.fullPath);
      let pipeline = sharp(sourceBuffer).resize(width, height, { fit: "cover" });

      const subsample = profileConfig.chromaSubsampling || "4:2:0";

      if (format === "avif") {
        pipeline = pipeline.avif({ quality, chromaSubsampling: subsample, effort: 4 });
      } else if (format === "webp") {
        pipeline = pipeline.webp({ quality, effort: 4 });
      } else if (format === "jpg" || format === "jpeg") {
        pipeline = pipeline.jpeg({ quality, chromaSubsampling: subsample, mozjpeg: true });
      }

      const buffer = await pipeline.toBuffer();
      fs.writeFileSync(outPath, buffer);

      const derivStat = fs.statSync(outPath);
      const derivBytes = derivStat.size;
      const sizeRatio = Number((derivBytes / asset.sizeBytes).toFixed(4));
      const reductionPercent = Number(((1 - sizeRatio) * 100).toFixed(2));

      // Delivery Value Evaluator
      const isSmaller = derivBytes < asset.sizeBytes;
      const isResponsiveTarget = width < sourceWidth;
      const hasDeliveryValue = isSmaller || isResponsiveTarget;

      if (!hasDeliveryValue) {
        fs.unlinkSync(outPath); // Discard non-valuable derivative
        continue;
      }

      const ssimScore = await calculateSSIM(asset.fullPath, outPath, width, height);
      const ssimEval = evaluateSSIMStatus(ssimScore);

      if (ssimEval.status === "FAIL_VISUAL_DEGRADATION") {
        fs.unlinkSync(outPath); // Discard degraded derivative
        continue;
      }

      results.push({
        path: outPath,
        format,
        width,
        height,
        sizeBytes: derivBytes,
        quality,
        sizeRatio,
        reductionPercent,
        ssim: ssimScore,
        validationStatus: ssimEval.status,
      });
    }
  }

  return results;
}
