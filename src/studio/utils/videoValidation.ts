/**
 * HOP Studio Video Validation and Frame Capture Utility
 * Enforces HOP media performance budget and extracts poster frames.
 */

export interface VideoValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
  duration: number;
  width: number;
  height: number;
  aspectRatio: string;
  fileSizeFormatted: string;
  fileSizeBytes: number;
  posterFile?: File;
}

const MAX_FILE_SIZE_BYTES = 30 * 1024 * 1024; // 30 MB
const MAX_DURATION_SECONDS = 60; // 60s max for looping ambient films

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export async function validateVideoFile(file: File): Promise<VideoValidationResult> {
  const fileSizeBytes = file.size;
  const fileSizeFormatted = formatBytes(fileSizeBytes);

  // 1. File Type Check
  const validTypes = ["video/mp4", "video/webm", "video/quicktime"];
  if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov)$/i)) {
    return {
      isValid: false,
      error: `Unsupported format (${file.type || file.name.split(".").pop()}). Please upload an MP4 (H.264) or WebM video.`,
      duration: 0,
      width: 0,
      height: 0,
      aspectRatio: "Unknown",
      fileSizeFormatted,
      fileSizeBytes,
    };
  }

  // 2. File Size Check
  if (fileSizeBytes > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File size (${fileSizeFormatted}) exceeds the production limit of 30 MB. Please compress the video before uploading.`,
      duration: 0,
      width: 0,
      height: 0,
      aspectRatio: "Unknown",
      fileSizeFormatted,
      fileSizeBytes,
    };
  }

  // 3. Inspect video element metadata & capture poster
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const objectUrl = URL.createObjectURL(file);
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.src = objectUrl;

    let warning: string | undefined;
    if (fileSizeBytes > 20 * 1024 * 1024) {
      warning = "File is between 20MB and 30MB. For optimal mobile LCP, <20MB is recommended.";
    }

    const cleanUp = () => {
      URL.revokeObjectURL(objectUrl);
      video.remove();
    };

    video.onloadedmetadata = () => {
      const duration = Math.round(video.duration * 10) / 10;
      const width = video.videoWidth;
      const height = video.videoHeight;
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
      const divisor = gcd(width, height) || 1;
      const aspectRatio = `${width / divisor}:${height / divisor}`;

      // Duration validation
      if (duration > MAX_DURATION_SECONDS) {
        cleanUp();
        resolve({
          isValid: false,
          error: `Duration (${duration}s) exceeds the maximum allowed collection film length (${MAX_DURATION_SECONDS}s).`,
          duration,
          width,
          height,
          aspectRatio,
          fileSizeFormatted,
          fileSizeBytes,
        });
        return;
      }

      // Seek to capture poster frame
      const seekTime = Math.min(1.0, duration > 1 ? 1.0 : duration / 2);
      video.currentTime = seekTime;

      video.onseeked = () => {
        let posterFile: File | undefined;
        try {
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0, width, height);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || "film";
                  posterFile = new File([blob], `${baseName}-poster.jpg`, { type: "image/jpeg" });
                }
                cleanUp();
                resolve({
                  isValid: true,
                  warning,
                  duration,
                  width,
                  height,
                  aspectRatio,
                  fileSizeFormatted,
                  fileSizeBytes,
                  posterFile,
                });
              },
              "image/jpeg",
              0.85
            );
            return;
          }
        } catch {
          // Poster extraction failed, but video itself is valid
        }

        cleanUp();
        resolve({
          isValid: true,
          warning,
          duration,
          width,
          height,
          aspectRatio,
          fileSizeFormatted,
          fileSizeBytes,
          posterFile,
        });
      };
    };

    video.onerror = () => {
      cleanUp();
      resolve({
        isValid: false,
        error: "Unable to read video file. It may be corrupt or encoded in an unsupported codec.",
        duration: 0,
        width: 0,
        height: 0,
        aspectRatio: "Unknown",
        fileSizeFormatted,
        fileSizeBytes,
      });
    };
  });
}
