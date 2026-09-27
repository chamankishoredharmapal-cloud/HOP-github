import { test, expect } from "@playwright/test";
import { formatBytes } from "../studio/utils/videoValidation";
import { getStudioEnvironment } from "../studio/utils/environment";

test.describe("HOP Studio — Unit & Logic Tests", () => {
  test("videoValidation: formatBytes correctly formats byte sizes", () => {
    expect(formatBytes(0)).toBe("0 Bytes");
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(1024 * 1024 * 14.2)).toBe("14.2 MB");
    expect(formatBytes(1024 * 1024 * 35)).toBe("35 MB");
  });

  test("environment: getStudioEnvironment returns valid studio environment descriptors", () => {
    const env = getStudioEnvironment();
    expect(["DEVELOPMENT", "STAGING", "PRODUCTION"]).toContain(env.name);
    expect(typeof env.isProduction).toBe("boolean");
    expect(typeof env.badgeLabel).toBe("string");
    expect(typeof env.badgeClass).toBe("string");
  });
});
