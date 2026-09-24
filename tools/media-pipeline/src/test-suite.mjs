import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { discoverMedia, calculateHash } from "./discovery.mjs";
import { validateMediaAsset, isPathProtected } from "./validate.mjs";
import { processImage } from "./processor.mjs";

async function runTestSuite() {
  console.log("\n==================================================");
  console.log(" HOP MEDIA PIPELINE INTEGRITY & VERIFICATION SUITE");
  console.log("==================================================\n");

  const testResults = [];

  // --- Test 1: Validation Test (Non-existent file & Corrupt file) ---
  console.log("[Test 1/5] Running Validation Failure Test...");
  const nonExistentAsset = { fullPath: "non_existent_file.png", extension: ".png", type: "image" };
  const valNonExistent = await validateMediaAsset(nonExistentAsset);

  const testTmpDir = path.resolve("tools/media-pipeline/test-tmp");
  fs.mkdirSync(testTmpDir, { recursive: true });
  const corruptFilePath = path.join(testTmpDir, "corrupt.png");
  fs.writeFileSync(corruptFilePath, ""); // 0-byte corrupt file
  const corruptAsset = { fullPath: corruptFilePath, extension: ".png", type: "image" };
  const valCorrupt = await validateMediaAsset(corruptAsset);

  const valPass = valNonExistent.status === "FAIL" && valCorrupt.status === "FAIL";
  testResults.push({
    test: "Validation Test (Nonexistent & Corrupt Files)",
    expected: "status: FAIL for both nonexistent and 0-byte corrupt files",
    actual: `nonExistent: ${valNonExistent.status} (${valNonExistent.error}), corrupt: ${valCorrupt.status} (${valCorrupt.error})`,
    pass: valPass,
  });

  // --- Test 2: No-Upscaling Invariant Test ---
  console.log("[Test 2/5] Running Aspect-Aware No-Upscaling Invariant Test...");
  const smallImgPath = path.join(testTmpDir, "small-480x320.png");
  await sharp({
    create: { width: 480, height: 320, channels: 4, background: { r: 200, g: 100, b: 50, alpha: 1 } },
  })
    .png()
    .toFile(smallImgPath);

  const smallAsset = {
    fullPath: smallImgPath,
    relPath: "tools/media-pipeline/test-tmp/small-480x320.png",
    filename: "small-480x320.png",
    extension: ".png",
    type: "image",
    sizeBytes: fs.statSync(smallImgPath).size,
    metadata: { width: 480, height: 320 },
  };

  const heroProfile = {
    targetWidths: [1920, 1600, 1200, 480],
    formats: ["avif", "webp"],
    quality: { avif: 75, webp: 80 },
  };

  const testOutDir = path.join(testTmpDir, "output");
  const smallDerivs = await processImage(smallAsset, heroProfile, testOutDir);

  const maxDerivedWidth = Math.max(...smallDerivs.map((d) => d.width));
  const maxDerivedHeight = Math.max(...smallDerivs.map((d) => d.height));
  const noUpscalePass = maxDerivedWidth <= 480 && maxDerivedHeight <= 320 && smallDerivs.every((d) => d.width <= 480);

  testResults.push({
    test: "No-Upscaling Invariant Test",
    expected: "Max derivative width <= 480px and height <= 320px (target widths 1920, 1600, 1200 skipped)",
    actual: `Source: 480x320. Generated ${smallDerivs.length} derivative(s). Max dimensions generated: ${maxDerivedWidth}x${maxDerivedHeight}px`,
    pass: noUpscalePass,
  });

  // --- Test 3: Path Guard / Protected Directory Safety Test ---
  console.log("[Test 3/5] Running Protected Directory Path Guard Test...");
  const protectedSrcPath = "src/assets/test.png";
  const protectedPublicPath = "public/test.png";
  const isSrcProtected = isPathProtected(protectedSrcPath, ".");
  const isPublicProtected = isPathProtected(protectedPublicPath, ".");
  const pathGuardPass = isSrcProtected && isPublicProtected;

  testResults.push({
    test: "Path Guard Protected Directory Test",
    expected: "isPathProtected returns true for targets resolving inside src/assets/, public/, src/content/",
    actual: `src/assets protected: ${isSrcProtected}, public protected: ${isPublicProtected}`,
    pass: pathGuardPass,
  });

  // --- Test 4: Idempotency Test ---
  console.log("[Test 4/5] Running Idempotency Test...");
  const run1Derivs = await processImage(smallAsset, heroProfile, testOutDir);
  const run2Derivs = await processImage(smallAsset, heroProfile, testOutDir);

  const sameCount = run1Derivs.length === run2Derivs.length;
  const sameSizes = run1Derivs.every((d, i) => d.sizeBytes === run2Derivs[i].sizeBytes);
  const idempotencyPass = sameCount && sameSizes;

  testResults.push({
    test: "Idempotency Test",
    expected: "Sequential identical optimization runs yield identical output derivative metadata & sizes",
    actual: `Run 1 derivatives: ${run1Derivs.length}, Run 2 derivatives: ${run2Derivs.length}. Identical sizes: ${sameSizes}`,
    pass: idempotencyPass,
  });

  // --- Test 5: Source Immutability SHA-256 Hash Verification ---
  console.log("[Test 5/5] Running Source Immutability Checksum Test...");
  const preHash = calculateHash(smallImgPath);
  await processImage(smallAsset, heroProfile, testOutDir);
  const postHash = calculateHash(smallImgPath);
  const immutabilityPass = preHash === postHash;

  testResults.push({
    test: "Source Immutability SHA-256 Test",
    expected: "Source SHA-256 hash identical before and after processing",
    actual: `preHash: ${preHash.slice(0, 16)}..., postHash: ${postHash.slice(0, 16)}...`,
    pass: immutabilityPass,
  });

  // Clean test temp files
  fs.rmSync(testTmpDir, { recursive: true, force: true });

  console.log("\n==================================================");
  console.log(" TEST SUITE SUMMARY");
  console.log("==================================================\n");

  let allPass = true;
  testResults.forEach((tr, i) => {
    const icon = tr.pass ? "✅ PASS" : "❌ FAIL";
    if (!tr.pass) allPass = false;
    console.log(`${icon} [${i + 1}/5] ${tr.test}`);
    console.log(`     Expected: ${tr.expected}`);
    console.log(`     Actual:   ${tr.actual}\n`);
  });

  if (!allPass) {
    console.error("❌ Test suite failed!");
    process.exit(1);
  } else {
    console.log("✅ ALL PIPELINE INTEGRITY TESTS PASSED SUCCESSFULLY.\n");
  }
}

runTestSuite().catch((err) => {
  console.error("Fatal Test Runner Exception:", err);
  process.exit(1);
});
