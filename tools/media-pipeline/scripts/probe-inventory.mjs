import fs from "node:fs";
import path from "node:path";
import { execa } from "execa";

const FFPROBE = "C:\\Users\\siddh\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffprobe.exe";

async function probe(file) {
  const { stdout } = await execa(FFPROBE, [
    "-v", "quiet",
    "-print_format", "json",
    "-show_format",
    "-show_streams",
    file,
  ]);
  const data = JSON.parse(stdout);
  const v = data.streams.find((s) => s.codec_type === "video");
  const size = fs.statSync(file).size;
  const ratio = (v.width / v.height).toFixed(4);
  const is16x9 = Math.abs((v.width / v.height) - (16 / 9)) < 0.01;
  const is9x16 = Math.abs((v.width / v.height) - (9 / 16)) < 0.01;
  const classification = is16x9 ? "16:9 Landscape" : is9x16 ? "9:16 Portrait" : "Other";
  return {
    file: path.basename(file),
    width: v.width,
    height: v.height,
    duration: parseFloat(data.format.duration).toFixed(2) + "s",
    codec: v.codec_name,
    sizeBytes: size,
    sizeMB: (size / (1024 * 1024)).toFixed(2) + " MB",
    ratio: `${v.width}x${v.height} (${ratio})`,
    classification,
  };
}

async function main() {
  const originalsDir = "tools/media-pipeline/videos/originals";
  const optimizedDir = "public/optimized/videos";

  const originals = [];
  for (const f of fs.readdirSync(originalsDir).filter((x) => x.endsWith(".mp4"))) {
    originals.push(await probe(path.join(originalsDir, f)));
  }

  const optimized = [];
  for (const f of fs.readdirSync(optimizedDir).filter((x) => x.endsWith(".mp4"))) {
    optimized.push(await probe(path.join(optimizedDir, f)));
  }

  const posters = [];
  for (const f of fs.readdirSync(optimizedDir).filter((x) => x.endsWith(".webp"))) {
    posters.push(await probe(path.join(optimizedDir, f)));
  }

  console.log("=== ORIGINAL VIDEOS ===");
  console.table(originals);
  console.log("\n=== OPTIMIZED VIDEOS ===");
  console.table(optimized);
  console.log("\n=== POSTERS ===");
  console.table(posters);
}

main().catch(console.error);
