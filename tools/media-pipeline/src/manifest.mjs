import fs from "node:fs";
import path from "node:path";

export function generateManifest(processedAssets, outputRootDir = "output") {
  let totalSourcesProcessed = 0;
  let totalDerivativesGenerated = 0;
  let originalTotalBytes = 0;
  let derivativeTotalBytes = 0;

  const manifestAssets = processedAssets.map((item) => {
    totalSourcesProcessed++;
    originalTotalBytes += item.asset.sizeBytes;

    const derivatives = item.derivatives.map((d) => {
      totalDerivativesGenerated++;
      derivativeTotalBytes += d.sizeBytes || 0;
      return {
        path: d.path.replace(/\\/g, "/"),
        format: d.format,
        width: d.width,
        height: d.height,
        sizeBytes: d.sizeBytes,
        quality: d.quality,
        sizeRatio: d.sizeRatio,
        reductionPercent: d.reductionPercent,
        ssim: d.ssim,
        validationStatus: d.validationStatus,
      };
    });

    return {
      source: {
        path: item.asset.relPath,
        filename: item.asset.filename,
        hash: item.asset.hash,
        format: item.asset.extension.replace(".", ""),
        width: item.asset.metadata?.width || 0,
        height: item.asset.metadata?.height || 0,
        sizeBytes: item.asset.sizeBytes,
      },
      profile: item.asset.profile,
      derivatives,
    };
  });

  const totalSavingsBytes = Math.max(0, originalTotalBytes - derivativeTotalBytes);
  const overallReductionPercent = originalTotalBytes > 0
    ? Number(((totalSavingsBytes / originalTotalBytes) * 100).toFixed(2))
    : 0;

  const manifestData = {
    pipelineVersion: "1.0.0",
    generatedAt: new Date().toISOString(),
    summary: {
      totalSourcesProcessed,
      totalDerivativesGenerated,
      originalTotalBytes,
      derivativeTotalBytes,
      totalSavingsBytes,
      overallReductionPercent,
    },
    assets: manifestAssets,
  };

  const manifestPath = path.join(outputRootDir, "manifest.json");
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2), "utf-8");

  return manifestData;
}

export function isIdempotent(asset, existingManifest) {
  if (!existingManifest || !existingManifest.assets) return false;
  const match = existingManifest.assets.find(
    (a) => a.source.path === asset.relPath && a.source.hash === asset.hash
  );
  return Boolean(match && match.derivatives && match.derivatives.length > 0);
}
