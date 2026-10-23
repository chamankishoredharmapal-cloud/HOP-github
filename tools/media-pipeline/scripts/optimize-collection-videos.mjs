import fs from "node:fs";
import path from "node:path";
import { execa } from "execa";

const FFMPEG_BIN = "C:\\Users\\siddh\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffmpeg.exe";
const FFPROBE_BIN = "C:\\Users\\siddh\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffprobe.exe";

const ORIGINALS_DIR = path.resolve("tools/media-pipeline/videos/originals");
const PIPELINE_OPT_DIR = path.resolve("tools/media-pipeline/videos/optimized");
const PIPELINE_POSTERS_DIR = path.resolve("tools/media-pipeline/videos/posters");
const PUBLIC_OPT_DIR = path.resolve("public/optimized/videos");

fs.mkdirSync(PIPELINE_OPT_DIR, { recursive: true });
fs.mkdirSync(PIPELINE_POSTERS_DIR, { recursive: true });
fs.mkdirSync(PUBLIC_OPT_DIR, { recursive: true });

// Standard collection targets with explicit canonical names
const KNOWN_TARGETS = [
  { slug: "hero", original: "HERO.mp4", canonical: "HERO" },
  { slug: "kalyani", original: "KALYANI_1.mp4", canonical: "KALYANI" },
  { slug: "viara", original: "VIARA3.mp4", canonical: "VIARA" },
  { slug: "arya", original: "ARYA.mp4", canonical: "ARYA" },
  { slug: "padma", original: "PADMA.mp4", canonical: "PADMA" },
  { slug: "spandana", original: "SPANDANA.mp4", canonical: "SPANDANA" },
];

async function probe(filePath) {
  const { stdout } = await execa(FFPROBE_BIN, [
    "-v", "quiet",
    "-print_format", "json",
    "-show_format",
    "-show_streams",
    filePath,
  ]);
  const data = JSON.parse(stdout);
  const vStream = data.streams.find((s) => s.codec_type === "video");
  if (!vStream) {
    throw new Error(`No video stream found in ${filePath}`);
  }
  return {
    width: vStream.width,
    height: vStream.height,
    codec: vStream.codec_name,
    duration: parseFloat(data.format.duration || "0"),
    bitrate: parseInt(data.format.bit_rate || "0", 10),
    hasAudio: data.streams.some((s) => s.codec_type === "audio"),
  };
}

function classifyAspectRatio(width, height) {
  const ratio = width / height;
  const is16x9 = Math.abs(ratio - 16 / 9) < 0.02;
  const is9x16 = Math.abs(ratio - 9 / 16) < 0.02;

  if (is16x9) {
    return {
      type: "16:9 Landscape",
      category: "16:9",
      standard: true,
      orientation: "landscape",
    };
  }
  if (is9x16) {
    return {
      type: "9:16 Portrait",
      category: "9:16",
      standard: true,
      orientation: "portrait",
    };
  }
  return {
    type: `${width}x${height} (${ratio.toFixed(3)})`,
    category: "custom",
    standard: false,
    orientation: width >= height ? "landscape" : "portrait",
  };
}

async function verifyFastStart(filePath) {
  const fd = fs.openSync(filePath, "r");
  const buffer = Buffer.alloc(4096);
  fs.readSync(fd, buffer, 0, 4096, 0);
  fs.closeSync(fd);
  const moovOffset = buffer.indexOf("moov");
  const mdatOffset = buffer.indexOf("mdat");
  return moovOffset !== -1 && (mdatOffset === -1 || moovOffset < mdatOffset);
}

async function verifyDecodeIntegrity(filePath) {
  try {
    await execa(FFMPEG_BIN, ["-v", "error", "-i", filePath, "-f", "null", "-"]);
    return true;
  } catch (err) {
    console.error(`Decoding error in ${filePath}:`, err.message);
    return false;
  }
}

async function computeSSIM(optPath, origPath) {
  try {
    const { stderr } = await execa(FFMPEG_BIN, [
      "-i", optPath,
      "-i", origPath,
      "-lavfi", "ssim",
      "-f", "null",
      "-",
    ]);
    const match = stderr.match(/All:([0-9.]+)/);
    return match ? parseFloat(match[1]) : null;
  } catch (err) {
    const match = (err.stderr || "").match(/All:([0-9.]+)/);
    return match ? parseFloat(match[1]) : null;
  }
}

function copyToPublic(sourcePath, destFilename) {
  const destPath = path.join(PUBLIC_OPT_DIR, destFilename);
  fs.copyFileSync(sourcePath, destPath);
}

async function processVideo(target, origPath) {
  const origStat = fs.statSync(origPath);
  const probeData = await probe(origPath);
  const classification = classifyAspectRatio(probeData.width, probeData.height);

  console.log(`\n--------------------------------------------------`);
  console.log(`Target: ${target.canonical} [${target.original}]`);
  console.log(`Source: ${probeData.width}x${probeData.height} | ${(origStat.size / 1024 / 1024).toFixed(2)} MB | ${classification.type} | Duration: ${probeData.duration.toFixed(2)}s`);
  if (!classification.standard) {
    console.warn(`[ATTENTION] Source ratio is non-standard (${classification.type}). Native aspect ratio will be preserved without stretching/cropping.`);
  }

  const variants = [];

  // Determine variant generation rules based on source resolution & standard aspect ratio
  // 1. 1080p Generation: ONLY if source genuinely supports it (no upscaling!)
  const supports1080p =
    (classification.category === "16:9" && probeData.width >= 1920 && probeData.height >= 1080) ||
    (classification.category === "9:16" && probeData.width >= 1080 && probeData.height >= 1920);

  if (supports1080p) {
    const out1080Name = `${target.canonical}-1080p.mp4`;
    const out1080Path = path.join(PIPELINE_OPT_DIR, out1080Name);
    const scaleFilter = classification.category === "16:9" ? "scale=1920:1080" : "scale=1080:1920";

    await execa(FFMPEG_BIN, [
      "-y",
      "-i", origPath,
      "-vf", scaleFilter,
      "-c:v", "libx264",
      "-crf", "22",
      "-preset", "slow",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      "-an",
      out1080Path,
    ]);
    const stat1080 = fs.statSync(out1080Path);
    const probe1080 = await probe(out1080Path);
    const fastStart1080 = await verifyFastStart(out1080Path);
    const valid1080 = await verifyDecodeIntegrity(out1080Path);
    const ssim1080 = await computeSSIM(out1080Path, origPath);
    copyToPublic(out1080Path, out1080Name);

    variants.push({
      variant: "1080p",
      width: probe1080.width,
      height: probe1080.height,
      sizeBytes: stat1080.size,
      sizeMB: (stat1080.size / 1024 / 1024).toFixed(2),
      savingsPercent: parseFloat(((1 - stat1080.size / origStat.size) * 100).toFixed(1)),
      fastStart: fastStart1080,
      decodeValid: valid1080,
      ssim: ssim1080,
    });
    console.log(`  + 1080p: ${probe1080.width}x${probe1080.height} (${(stat1080.size / 1024 / 1024).toFixed(2)} MB, SSIM: ${ssim1080})`);
  } else {
    console.log(`  - 1080p skipped: source is ${probeData.width}x${probeData.height} (preserving no-upscaling standard)`);
  }

  // 2. 720p Master Variant (Standard baseline)
  const out720Name = `${target.canonical}-720p.mp4`;
  const out720Path = path.join(PIPELINE_OPT_DIR, out720Name);
  let scale720Filter;
  if (classification.category === "16:9") {
    scale720Filter = "scale=w='min(1280,iw)':h=-2";
  } else if (classification.category === "9:16") {
    scale720Filter = "scale=w='min(720,iw)':h=-2";
  } else {
    // Custom ratio: ensure even dimensions without stretching
    scale720Filter = "scale='trunc(iw/2)*2':'trunc(ih/2)*2'";
  }

  await execa(FFMPEG_BIN, [
    "-y",
    "-i", origPath,
    "-vf", scale720Filter,
    "-c:v", "libx264",
    "-crf", "23",
    "-preset", "slow",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    "-an",
    out720Path,
  ]);
  const stat720 = fs.statSync(out720Path);
  const probe720 = await probe(out720Path);
  const fastStart720 = await verifyFastStart(out720Path);
  const valid720 = await verifyDecodeIntegrity(out720Path);
  const ssim720 = await computeSSIM(out720Path, origPath);
  copyToPublic(out720Path, out720Name);

  variants.push({
    variant: "720p",
    width: probe720.width,
    height: probe720.height,
    sizeBytes: stat720.size,
    sizeMB: (stat720.size / 1024 / 1024).toFixed(2),
    savingsPercent: parseFloat(((1 - stat720.size / origStat.size) * 100).toFixed(1)),
    fastStart: fastStart720,
    decodeValid: valid720,
    ssim: ssim720,
  });
  console.log(`  + 720p:  ${probe720.width}x${probe720.height} (${(stat720.size / 1024 / 1024).toFixed(2)} MB, savings: ${((1 - stat720.size / origStat.size) * 100).toFixed(1)}%, SSIM: ${ssim720})`);

  // 3. 540p Mobile Variant
  const out540Name = `${target.canonical}-540p.mp4`;
  const out540Path = path.join(PIPELINE_OPT_DIR, out540Name);
  let scale540Filter;
  if (classification.category === "16:9") {
    scale540Filter = "scale=w='min(960,iw)':h=-2";
  } else if (classification.category === "9:16") {
    scale540Filter = "scale=w='min(540,iw)':h=-2";
  } else {
    scale540Filter = "scale=w='min(540,iw)':h=-2";
  }

  await execa(FFMPEG_BIN, [
    "-y",
    "-i", origPath,
    "-vf", scale540Filter,
    "-c:v", "libx264",
    "-crf", "25",
    "-preset", "slow",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    "-an",
    out540Path,
  ]);
  const stat540 = fs.statSync(out540Path);
  const probe540 = await probe(out540Path);
  const fastStart540 = await verifyFastStart(out540Path);
  const valid540 = await verifyDecodeIntegrity(out540Path);
  copyToPublic(out540Path, out540Name);

  variants.push({
    variant: "540p",
    width: probe540.width,
    height: probe540.height,
    sizeBytes: stat540.size,
    sizeMB: (stat540.size / 1024 / 1024).toFixed(2),
    savingsPercent: parseFloat(((1 - stat540.size / origStat.size) * 100).toFixed(1)),
    fastStart: fastStart540,
    decodeValid: valid540,
    ssim: null,
  });
  console.log(`  + 540p:  ${probe540.width}x${probe540.height} (${(stat540.size / 1024 / 1024).toFixed(2)} MB, savings: ${((1 - stat540.size / origStat.size) * 100).toFixed(1)}%)`);

  // 4. Poster Frame (WebP, quality 85, extracted at t=0.5s)
  const posterName = `${target.canonical}-poster.webp`;
  const posterPath = path.join(PIPELINE_POSTERS_DIR, posterName);
  const seekTime = probeData.duration > 1 ? "0.5" : "0.1";

  await execa(FFMPEG_BIN, [
    "-y",
    "-ss", seekTime,
    "-i", origPath,
    "-vframes", "1",
    "-c:v", "libwebp",
    "-quality", "85",
    posterPath,
  ]);
  const statPoster = fs.statSync(posterPath);
  copyToPublic(posterPath, posterName);
  console.log(`  + Poster: ${(statPoster.size / 1024).toFixed(1)} KB WebP`);

  return {
    slug: target.slug,
    canonical: target.canonical,
    originalFile: target.original,
    originalDimensions: `${probeData.width}x${probeData.height}`,
    originalSizeBytes: origStat.size,
    originalSizeMB: (origStat.size / 1024 / 1024).toFixed(2),
    orientation: classification.orientation,
    aspectRatioType: classification.type,
    isStandardAspect: classification.standard,
    variants,
    poster: {
      filename: posterName,
      sizeBytes: statPoster.size,
      sizeKB: (statPoster.size / 1024).toFixed(1),
    },
  };
}

async function run() {
  console.log("===============================================================================");
  console.log(" HOP VIDEO OPTIMIZATION & ASPECT RATIO STANDARDIZATION PIPELINE");
  console.log("===============================================================================");

  const report = [];

  // 1. Process known targets
  for (const target of KNOWN_TARGETS) {
    const origPath = path.join(ORIGINALS_DIR, target.original);
    if (!fs.existsSync(origPath)) {
      console.error(`Missing target original: ${origPath}`);
      continue;
    }
    const item = await processVideo(target, origPath);
    report.push(item);
  }

  // 2. Discover any additional original videos uploaded in the originals directory
  const processedOriginals = new Set(KNOWN_TARGETS.map((t) => t.original.toLowerCase()));
  const allOriginalFiles = fs.readdirSync(ORIGINALS_DIR).filter((f) => {
    return /\.(mp4|mov|webm)$/i.test(f) && !processedOriginals.has(f.toLowerCase());
  });

  for (const extraFile of allOriginalFiles) {
    const baseSlug = path.parse(extraFile).name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const canonical = path.parse(extraFile).name.toUpperCase().replace(/[^A-Z0-9]+/g, "_");
    const origPath = path.join(ORIGINALS_DIR, extraFile);
    const target = { slug: baseSlug, original: extraFile, canonical };
    const item = await processVideo(target, origPath);
    report.push(item);
  }

  const outputPath = path.resolve("tools/media-pipeline/output/video-optimization-summary.json");
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

  console.log("\n===============================================================================");
  console.log(" PIPELINE SUMMARY & COMPLIANCE TABLE");
  console.log("===============================================================================");

  const tableData = report.map((r) => {
    const v720 = r.variants.find((v) => v.variant === "720p");
    const v540 = r.variants.find((v) => v.variant === "540p");
    return {
      Canonical: r.canonical,
      "Source Dimensions": r.originalDimensions,
      "Aspect Ratio": r.aspectRatioType,
      Orientation: r.orientation,
      "Standard (16:9 / 9:16)": r.isStandardAspect ? "YES (Standard)" : "FLAGGED (Custom)",
      "720p Out": v720 ? `${v720.width}x${v720.height} (${v720.sizeMB} MB)` : "N/A",
      "540p Out": v540 ? `${v540.width}x${v540.height} (${v540.sizeMB} MB)` : "N/A",
      "720p SSIM": v720?.ssim ?? "N/A",
      "FastStart OK": v720?.fastStart ? "YES" : "NO",
      "Decode OK": v720?.decodeValid ? "YES" : "NO",
    };
  });

  console.table(tableData);
  console.log(`\nPipeline complete. Report written to ${outputPath}`);
}

run().catch((err) => {
  console.error("Pipeline failure:", err);
  process.exit(1);
});
