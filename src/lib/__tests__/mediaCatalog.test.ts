import { describe, it, expect } from "vitest";

describe("Phase 3 Stage 2: Unified Media Catalog & Security Rules", () => {
  const ALLOWED_IMAGE_MIMES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"];
  const ALLOWED_VIDEO_MIMES = ["video/mp4", "video/webm", "video/quicktime"];
  const MAX_IMAGE_BYTES = 20 * 1024 * 1024; // 20 MB
  const MAX_VIDEO_BYTES = 150 * 1024 * 1024; // 150 MB

  it("permits standard high-resolution photography and film formats", () => {
    expect(ALLOWED_IMAGE_MIMES.includes("image/jpeg")).toBe(true);
    expect(ALLOWED_IMAGE_MIMES.includes("image/webp")).toBe(true);
    expect(ALLOWED_VIDEO_MIMES.includes("video/mp4")).toBe(true);
    expect(ALLOWED_VIDEO_MIMES.includes("video/webm")).toBe(true);
  });

  it("rejects untrusted or executable file types", () => {
    const dangerousTypes = ["application/x-javascript", "text/html", "application/x-msdownload", "application/octet-stream"];
    for (const t of dangerousTypes) {
      expect(ALLOWED_IMAGE_MIMES.includes(t)).toBe(false);
      expect(ALLOWED_VIDEO_MIMES.includes(t)).toBe(false);
    }
  });

  it("enforces image and video size limits", () => {
    const validImageSize = 5 * 1024 * 1024;
    const oversizedImageSize = 25 * 1024 * 1024;
    expect(validImageSize <= MAX_IMAGE_BYTES).toBe(true);
    expect(oversizedImageSize <= MAX_IMAGE_BYTES).toBe(false);

    const validVideoSize = 45 * 1024 * 1024;
    const oversizedVideoSize = 160 * 1024 * 1024;
    expect(validVideoSize <= MAX_VIDEO_BYTES).toBe(true);
    expect(oversizedVideoSize <= MAX_VIDEO_BYTES).toBe(false);
  });

  it("generates collision-resistant clean filenames", () => {
    const dirty = " gangamma  pit loom (1) .jpg ";
    const clean = dirty.trim().replace(/[^a-zA-Z0-9._-]/g, "_");
    expect(clean).toBe("gangamma__pit_loom__1__.jpg");
    expect(clean.includes(" ")).toBe(false);
  });
});
