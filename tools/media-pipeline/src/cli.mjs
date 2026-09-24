import fs from "node:fs";
import path from "node:path";
import { Command } from "commander";
import { discoverMedia, calculateHash } from "./discovery.mjs";
import { validateMediaAsset } from "./validate.mjs";
import { processImage } from "./processor.mjs";
import { processVideo } from "./video.mjs";
import { generateManifest } from "./manifest.mjs";
import { writeOptimizationReport } from "./reporter.mjs";

const profiles = JSON.parse(fs.readFileSync(new URL("../config/profiles.json", import.meta.url), "utf-8"));

const program = new Command();

program
  .name("hop-media-pipeline")
  .description("House of Padmavati (HOP) Media Infrastructure & Optimization Pipeline")
  .version("1.0.0");

program
  .command("audit")
  .description("Audit existing media assets without modifying any files")
  .action(() => {
    console.log("\n==================================================");
    console.log(" HOP MEDIA INFRASTRUCTURE AUDIT");
    console.log("==================================================\n");

    const { discovered, ignored, errors } = discoverMedia(".");
    const images = discovered.filter((a) => a.type === "image");
    const videos = discovered.filter((a) => a.type === "video");

    const totalBytes = discovered.reduce((sum, a) => sum + a.sizeBytes, 0);

    console.log(`Total Discovered Media Assets: ${discovered.length}`);
    console.log(`  - Images: ${images.length}`);
    console.log(`  - Videos: ${videos.length}`);
    console.log(`Ignored Content Files: ${ignored.length}`);
    console.log(`Total Discovered Payload: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB (${totalBytes} bytes)\n`);

    const sorted = [...discovered].sort((a, b) => b.sizeBytes - a.sizeBytes);
    console.log("Top 10 Largest Discovered Media Assets:");
    sorted.slice(0, 10).forEach((item, idx) => {
      console.log(`  ${idx + 1}. ${item.relPath} — ${(item.sizeBytes / (1024 * 1024)).toFixed(2)} MB (${item.profile} profile)`);
    });

    if (errors.length > 0) {
      console.log("\nScan Warnings / Errors:");
      errors.forEach((e) => console.log(`  ⚠ ${e.path}: ${e.error}`));
    }

    console.log("\n✅ Audit complete. Source files untouched.\n");
  });

program
  .command("optimize")
  .description("Optimize media assets through controlled stage rollout")
  .option("--dry-run", "Simulate processing without writing any output files", false)
  .option("--stage <number>", "Rollout stage: 1 (Hero test), 2 (Sample test), 3 (Full library)", "1")
  .option("--input <path>", "Specific asset path to process")
  .option("--profile <name>", "Override profile for specified input")
  .option("--with-jpeg", "Include JPEG fallback format in output", false)
  .action(async (options) => {
    const stageNum = parseInt(options.stage, 10);
    const dryRun = options.dryRun;

    console.log("\n==================================================");
    console.log(` HOP MEDIA PIPELINE OPTIMIZATION (STAGE ${stageNum})`);
    console.log("==================================================");
    if (dryRun) console.log(" *** DRY RUN MODE — ZERO FILES WRITTEN ***\n");

    const { discovered } = discoverMedia(".");
    let targetAssets = [];

    if (options.input) {
      const match = discovered.find((a) => a.relPath === options.input || a.fullPath === path.resolve(options.input));
      if (!match) {
        console.error(`❌ Error: Specified input file not found: ${options.input}`);
        process.exit(1);
      }
      if (options.profile) match.profile = options.profile;
      targetAssets = [match];
    } else if (stageNum === 1) {
      // Stage 1: Controlled test on src/assets/hero-image.png ONLY
      const heroMatch = discovered.find((a) => a.relPath.includes("hero-image.png"));
      if (!heroMatch) {
        console.error("❌ Stage 1 Error: Target hero image 'src/assets/hero-image.png' not found!");
        process.exit(1);
      }
      targetAssets = [heroMatch];
    } else if (stageNum === 2) {
      // Stage 2: Representative sample (5 assets)
      const sampleConfig = [
        { path: "src/assets/organic-earring.png", profile: "product" },
        { path: "src/assets/circular-collection.png", profile: "collection" },
        { path: "src/assets/hop-fabric.jpg", profile: "editorial" },
        { path: "public/founders.png", profile: "general" },
        { path: "src/assets/hop-brand-board.png", profile: "hero" },
      ];
      targetAssets = sampleConfig.map((cfg) => {
        const asset = discovered.find((a) => a.relPath === cfg.path || a.relPath.endsWith(cfg.path));
        if (!asset) {
          console.error(`❌ Stage 2 Error: Target asset '${cfg.path}' not found!`);
          process.exit(1);
        }
        asset.profile = cfg.profile;
        return asset;
      });
    } else if (stageNum === 3) {
      // Stage 3: Full library
      targetAssets = discovered;
    } else {
      console.error("❌ Invalid stage specified. Use --stage 1, --stage 2, or --stage 3.");
      process.exit(1);
    }

    console.log(`Selected ${targetAssets.length} asset(s) for Stage ${stageNum} execution.\n`);

    // Pre-processing SHA-256 Checksums
    const preHashes = new Map();
    for (const asset of targetAssets) {
      preHashes.set(asset.fullPath, calculateHash(asset.fullPath));
    }

    const processedItems = [];

    for (const asset of targetAssets) {
      console.log(`Processing [${asset.profile.toUpperCase()}]: ${asset.relPath}...`);
      const val = await validateMediaAsset(asset);
      if (val.status === "FAIL") {
        console.error(`  ✖ Validation failed for ${asset.relPath}: ${val.error}`);
        continue;
      }
      asset.metadata = val.metadata;

      const profileConfig = profiles[asset.profile] || profiles.general;
      let derivatives = [];

      if (asset.type === "image") {
        derivatives = await processImage(asset, profileConfig, "tools/media-pipeline/output", {
          dryRun,
          forceJpeg: options.withJpeg,
        });
      } else if (asset.type === "video") {
        derivatives = await processVideo(asset, profileConfig, "tools/media-pipeline/output", { dryRun });
      }

      processedItems.push({ asset, derivatives });
      console.log(`  ✓ Generated ${derivatives.length} derivative(s).`);
    }

    // Post-processing SHA-256 Immutability Check
    for (const asset of targetAssets) {
      const postHash = calculateHash(asset.fullPath);
      const preHash = preHashes.get(asset.fullPath);
      if (postHash !== preHash) {
        console.error(`\nCRITICAL SECURITY VIOLATION: Source asset ${asset.relPath} was modified during processing!`);
        process.exit(1);
      }
    }
    console.log("\n🔒 Source Asset Immutability Verified: All pre/post SHA-256 hashes 100% match.");

    if (!dryRun) {
      const manifest = generateManifest(processedItems, "tools/media-pipeline/output");
      writeOptimizationReport(
        {
          stage: stageNum,
          stageDescription: stageNum === 1 ? "Controlled Test — hero-image.png" : stageNum === 2 ? "Representative Sample" : "Full Library",
          status: "SUCCESS",
          discovery: {
            discoveredCount: discovered.length,
            imageCount: discovered.filter((a) => a.type === "image").length,
            videoCount: discovered.filter((a) => a.type === "video").length,
            ignoredCount: 0,
          },
          manifest,
        },
        "MEDIA_OPTIMIZATION_REPORT.md"
      );
      console.log("📄 Manifest generated at: tools/media-pipeline/output/manifest.json");
      console.log("📝 Report generated at: MEDIA_OPTIMIZATION_REPORT.md");
    }

    console.log(`\n🛑 STAGE ${stageNum} COMPLETE — STOPPED FOR CTO REVIEW.\n`);
  });

program.parse(process.argv);
