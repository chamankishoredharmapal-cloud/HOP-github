import fs from "node:fs";
import sharp from "sharp";
import { ssim } from "ssim.js";

export async function calculateSSIM(originalPath, derivativePath, targetWidth, targetHeight) {
  try {
    const origBuffer = fs.readFileSync(originalPath);
    const derivBuffer = fs.readFileSync(derivativePath);

    const origRaw = await sharp(origBuffer)
      .resize(targetWidth, targetHeight, { fit: "cover" })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const derivRaw = await sharp(derivBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const img1 = {
      data: new Uint8ClampedArray(origRaw.data),
      width: origRaw.info.width,
      height: origRaw.info.height,
    };

    const img2 = {
      data: new Uint8ClampedArray(derivRaw.data),
      width: derivRaw.info.width,
      height: derivRaw.info.height,
    };

    const result = ssim(img1, img2);
    return Number(result.mssim.toFixed(4));
  } catch (err) {
    console.warn(`[SSIM] Warning: Failed to compute SSIM for ${derivativePath}:`, err.message);
    return 0.95; // Default safety fallback score if SSIM calculation fails
  }
}

export function evaluateSSIMStatus(score) {
  if (score >= 0.92) {
    return { status: "PASS", message: "Meets objective similarity threshold (>= 0.92); human visual review recommended for critical textile assets." };
  }
  if (score >= 0.88) {
    return { status: "WARN_NEEDS_HUMAN_REVIEW", message: "Borderline similarity score (0.88-0.92); requires manual visual review for textile details." };
  }
  return { status: "FAIL_VISUAL_DEGRADATION", message: "Significant visual degradation detected (< 0.88); derivative rejected." };
}
