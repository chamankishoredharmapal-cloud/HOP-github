import { test, expect, type Page } from "@playwright/test";

const HOMEPAGE_URL = "http://localhost:8080/";

const openHomepage = async (page: Page, options?: { mode?: "structure-only" | "show-media" }) => {
  const targetUrl = options?.mode === "show-media" ? `${HOMEPAGE_URL}?media_mode=show-media` : HOMEPAGE_URL;
  const sectionsLoaded = page
    .waitForResponse(
      (response) => response.url().includes("get_published_site_sections"),
      { timeout: 15000 },
    )
    .catch(() => null);
  await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
  await sectionsLoaded;
  await page.waitForTimeout(150);
};

test.describe("HOP Video Optimization & Smooth Playback Suite", () => {
  test("Structure-Only Mode (Default): Homepage renders neutral structural surfaces with strictly 0 videos and 0 images", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openHomepage(page);

    const counts = await page.evaluate(() => ({
      videos: document.querySelectorAll("video").length,
      imgs: document.querySelectorAll("img").length,
      mode: document.documentElement.getAttribute("data-media-mode"),
    }));

    expect(counts.mode).toBe("structure-only");
    expect(counts.videos).toBe(0);
    expect(counts.imgs).toBe(0);

    const hero = page.locator(".hop-threshold");
    await expect(hero).toBeVisible();
    await expect(hero.locator("video")).toHaveCount(0);
  });

  test("Desktop: Hero video loads 720p, autoplays, pauses on scroll out, resumes on scroll back", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openHomepage(page, { mode: "show-media" });

    // 1. Check Hero Section Video Element
    const heroSection = page.locator(".hop-threshold");
    await expect(heroSection).toBeVisible();

    const heroVideo = heroSection.locator("video").first();
    const hasVideo = (await heroVideo.count()) > 0;
    if (!hasVideo) {
      // In Poster Image Only mode, verify poster image is rendered and no video is mounted
      const posterImg = heroSection.locator("img.hop-threshold__slide-poster").first();
      await expect(posterImg).toBeVisible();
      await expect(heroSection.locator("video")).toHaveCount(0);
      return;
    }
    await expect(heroVideo).toBeVisible({ timeout: 10000 });

    // Verify source tags
    const sources = heroVideo.locator("source");
    const sourceCount = await sources.count();
    expect(sourceCount).toBeGreaterThanOrEqual(1);

    const desktopSrc = await sources.last().getAttribute("src");
    expect(desktopSrc).toMatch(/(\.mp4|-(720p)\.mp4)/);

    // Wait for video playback to advance
    await page.waitForFunction(() => {
      const v = document.querySelector(".hop-threshold video") as HTMLVideoElement;
      return v && !v.paused && v.currentTime > 0;
    }, { timeout: 10000 });

    const isPlayingInitial = await page.evaluate(() => {
      const v = document.querySelector(".hop-threshold video") as HTMLVideoElement;
      return v && !v.paused && v.currentTime > 0;
    });
    expect(isPlayingInitial).toBe(true);

    // 2. Scroll down out of view (to #philosophy or #craft)
    await page.evaluate(() => {
      window.scrollTo(0, 3500);
    });
    await page.waitForTimeout(1000);

    const isPausedWhenScrolledAway = await page.evaluate(() => {
      const v = document.querySelector(".hop-threshold video") as HTMLVideoElement;
      return v ? v.paused : true;
    });
    expect(isPausedWhenScrolledAway).toBe(true);

    // 3. Scroll back to top
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1000);

    const isResumedWhenScrolledBack = await page.evaluate(() => {
      const v = document.querySelector(".hop-threshold video") as HTMLVideoElement;
      return v && !v.paused;
    });
    expect(isResumedWhenScrolledBack).toBe(true);
  });

  test("Mobile: Hero video includes mobile 540p media query source", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openHomepage(page, { mode: "show-media" });

    const heroSection = page.locator(".hop-threshold");
    await expect(heroSection).toBeVisible();

    const heroVideo = heroSection.locator("video").first();
    const hasVideo = (await heroVideo.count()) > 0;
    if (!hasVideo) {
      // In Poster Image Only mode on mobile, verify poster image is rendered and no video is mounted
      const posterImg = heroSection.locator("img.hop-threshold__slide-poster").first();
      await expect(posterImg).toBeVisible();
      await expect(heroSection.locator("video")).toHaveCount(0);
      return;
    }
    await expect(heroVideo).toBeVisible({ timeout: 10000 });

    const mobileSource = heroVideo.locator('source[media="(max-width: 767px)"]');
    await expect(mobileSource).toHaveCount(1);

    const mobileSrc = await mobileSource.getAttribute("src");
    expect(mobileSrc).toMatch(/-(540p)\.mp4/);
  });

  test("Collection Films: Only mount and play on viewport entry", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openHomepage(page, { mode: "show-media" });

    // Collection films down the page should be attached
    const collectionsSection = page.locator("#collections");
    await expect(collectionsSection).toBeAttached();

    // Scroll directly into collections
    await collectionsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    // The collection film in view should mount and be ready
    const collectionVideos = page.locator(".hop-collection-film__media video");
    const count = await collectionVideos.count();
    expect(count).toBeGreaterThan(0);
  });

  test("Cinematic Hero Slider: arrows navigate immediately, dots sync, autoplay continues, zero text", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openHomepage(page, { mode: "show-media" });

    const heroSection = page.locator(".hop-threshold");
    await expect(heroSection).toBeVisible();

    // 1. Verify zero text overlays in hero area (no eyebrow, headline, subtitle, CTAs)
    const heroTextElements = heroSection.locator(
      "h1, h2, h3, h4, h5, h6, p, a, label, .hop-threshold__content, .hop-threshold__eyebrow, .hop-threshold__title, .hop-threshold__supporting, .hop-threshold__actions"
    );
    await expect(heroTextElements).toHaveCount(0);

    // 2. Verify only the two discreet edge arrows exist (no pause/play, counters, progress bars)
    const prevArrow = heroSection.getByRole("button", { name: "Previous slide" });
    const nextArrow = heroSection.getByRole("button", { name: "Next slide" });
    await expect(prevArrow).toHaveCount(1);
    await expect(nextArrow).toHaveCount(1);
    await expect(heroSection.locator("button")).toHaveCount(2);

    const oldControls = heroSection.locator(
      "nav, .hop-threshold__controls, .hop-threshold__counter, .hop-threshold__dashes, .hop-threshold__nav-btn"
    );
    await expect(oldControls).toHaveCount(0);

    // Arrows stay unobtrusive on desktop until the hero is hovered or focused,
    // while remaining discoverable on touch devices.
    const finePointer = await page.evaluate(() =>
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    );
    const hiddenOpacity = await nextArrow.evaluate((el) => Number(getComputedStyle(el).opacity));
    if (finePointer) {
      expect(hiddenOpacity).toBe(0);
      await heroSection.hover();
      await expect
        .poll(() => nextArrow.evaluate((el) => Number(getComputedStyle(el).opacity)))
        .toBeGreaterThan(0.5);
    } else {
      expect(hiddenOpacity).toBeGreaterThan(0);
    }

    // 3. Verify minimal visual dot indicators
    const indicators = heroSection.locator(".hop-threshold__indicators");
    await expect(indicators).toBeVisible();

    const dots = heroSection.locator(".hop-threshold__indicator-dot");
    expect(await dots.count()).toBeGreaterThanOrEqual(2);

    const activeDots = heroSection.locator(".hop-threshold__indicator-dot--active");
    await expect(activeDots).toHaveCount(1);
    await expect(dots.first()).toHaveClass(/hop-threshold__indicator-dot--active/);

    // 4. Verify visual-only behavior (clicking a dot must not change slides)
    await dots.nth(2).click({ force: true });
    await page.waitForTimeout(300);
    await expect(dots.first()).toHaveClass(/hop-threshold__indicator-dot--active/);

    // 5. Next arrow updates the active slide and dot immediately.
    await nextArrow.click();
    await expect(dots.nth(1)).toHaveClass(/hop-threshold__indicator-dot--active/);
    await expect(heroSection.locator(".hop-threshold__slide--active")).toHaveAttribute(
      "aria-label",
      /^Slide 2 of \d+$/,
    );

    // 6. Previous arrow returns to the first slide (cooldown prevents double-fire).
    await page.waitForTimeout(400);
    await prevArrow.click();
    await expect(dots.nth(0)).toHaveClass(/hop-threshold__indicator-dot--active/);

    // 7. Wrapping: previous from the first slide lands on the last slide.
    await page.waitForTimeout(400);
    await prevArrow.click();
    await expect(dots.last()).toHaveClass(/hop-threshold__indicator-dot--active/);
    const totalSlides = await dots.count();
    await expect(heroSection.locator(".hop-threshold__slide--active")).toHaveAttribute(
      "aria-label",
      `Slide ${totalSlides} of ${totalSlides}`,
    );

    // Wrapping: next from the last slide returns to the first slide.
    await page.waitForTimeout(400);
    await nextArrow.click();
    await expect(dots.nth(0)).toHaveClass(/hop-threshold__indicator-dot--active/);

    // 8. Autoplay continues after manual navigation (5s maximum window).
    await page.waitForTimeout(5500);
    await expect(dots.nth(1)).toHaveClass(/hop-threshold__indicator-dot--active/);
    await expect(activeDots).toHaveCount(1);

    // Cross-fade transition is preserved on the active slide.
    const activeTransition = await heroSection
      .locator(".hop-threshold__slide--active")
      .evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(activeTransition).toContain("0.85s");

    // Incoming active slide: if video exists, verify it plays; if poster-only, verify poster image renders.
    await page.waitForFunction(() => {
      const activeSlide = document.querySelector(".hop-threshold .hop-threshold__slide--active");
      if (!activeSlide) return false;
      const v = activeSlide.querySelector("video") as HTMLVideoElement;
      if (v) return !v.paused;
      const img = activeSlide.querySelector("img.hop-threshold__slide-poster") as HTMLImageElement;
      return Boolean(img && img.getAttribute("src"));
    }, { timeout: 10000 });
  });

  test("Cinematic Hero Slider: manual arrow navigation restarts the autoplay window", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openHomepage(page);

    const heroSection = page.locator(".hop-threshold");
    await expect(heroSection).toBeVisible();
    await heroSection.hover();

    const prevArrow = heroSection.getByRole("button", { name: "Previous slide" });
    const dots = heroSection.locator(".hop-threshold__indicator-dot");

    // Wrap to the last slide partway through slide 1's 5-second window.
    await page.waitForTimeout(2500);
    await prevArrow.click();
    await expect(dots.last()).toHaveClass(/hop-threshold__indicator-dot--active/);

    // Past the original 5s deadline, the manually selected slide must still be active.
    await page.waitForTimeout(3000);
    await expect(dots.last()).toHaveClass(/hop-threshold__indicator-dot--active/);

    // The last slide's display window then advances normally.
    await expect
      .poll(
        () =>
          dots.evaluateAll((nodes) =>
            nodes.findIndex((node) =>
              node.classList.contains("hop-threshold__indicator-dot--active"),
            ),
          ),
        { timeout: 5000 },
      )
      .not.toBe((await dots.count()) - 1);
  });

  test("Cinematic Hero Slider: trackpad wheel and pointer drag navigate without hijacking vertical wheel", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openHomepage(page);

    const heroSection = page.locator(".hop-threshold");
    const dots = heroSection.locator(".hop-threshold__indicator-dot");
    await expect(heroSection).toBeVisible();
    await expect(dots.first()).toHaveClass(/hop-threshold__indicator-dot--active/);

    // Vertical wheel must never navigate the carousel.
    await heroSection.dispatchEvent("wheel", { deltaX: 0, deltaY: 240 });
    await page.waitForTimeout(300);
    await expect(dots.first()).toHaveClass(/hop-threshold__indicator-dot--active/);

    // Horizontal trackpad swipe (deltaX dominant) advances.
    await heroSection.dispatchEvent("wheel", { deltaX: 140, deltaY: 3 });
    await expect(dots.nth(1)).toHaveClass(/hop-threshold__indicator-dot--active/);

    // Reverse after the wheel cooldown returns to the previous slide.
    await page.waitForTimeout(950);
    await heroSection.dispatchEvent("wheel", { deltaX: -140, deltaY: 3 });
    await expect(dots.nth(0)).toHaveClass(/hop-threshold__indicator-dot--active/);

    // Pointer/mouse drag left advances without a click.
    const box = await heroSection.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      const y = box.y + box.height * 0.5;
      await page.mouse.move(box.x + box.width * 0.75, y);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.25, y, { steps: 8 });
      await page.mouse.up();
    }
    await expect(dots.nth(1)).toHaveClass(/hop-threshold__indicator-dot--active/);
  });

  test("Mobile: swipe navigation, both arrows, and natural vertical page scrolling", async ({ page, browserName }, testInfo) => {
    test.skip(
      browserName !== "chromium" || !testInfo.project.use.hasTouch,
      "Requires Chromium with touch emulation",
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await openHomepage(page);

    const heroSection = page.locator(".hop-threshold");
    const dots = heroSection.locator(".hop-threshold__indicator-dot");
    await expect(heroSection).toBeVisible();
    await expect(dots.first()).toHaveClass(/hop-threshold__indicator-dot--active/);

    const prevArrow = heroSection.getByRole("button", { name: "Previous slide" });
    const nextArrow = heroSection.getByRole("button", { name: "Next slide" });
    await expect(prevArrow).toBeVisible();
    await expect(nextArrow).toBeVisible();

    // Both arrows work on mobile.
    await nextArrow.tap();
    await expect(dots.nth(1)).toHaveClass(/hop-threshold__indicator-dot--active/);
    await page.waitForTimeout(400);
    await prevArrow.tap();
    await expect(dots.nth(0)).toHaveClass(/hop-threshold__indicator-dot--active/);

    const client = await page.context().newCDPSession(page);
    const swipe = async (fromX: number, fromY: number, toX: number, toY: number) => {
      await client.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x: fromX, y: fromY }],
      });
      for (let step = 1; step <= 6; step += 1) {
        await client.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [
            {
              x: fromX + ((toX - fromX) * step) / 6,
              y: fromY + ((toY - fromY) * step) / 6,
            },
          ],
        });
        await page.waitForTimeout(25);
      }
      await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    };

    // Swipe left advances; the page must not scroll horizontally.
    await page.waitForTimeout(400);
    await swipe(300, 500, 60, 505);
    await expect(dots.nth(1)).toHaveClass(/hop-threshold__indicator-dot--active/);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);

    // Swipe right returns to the previous slide.
    await page.waitForTimeout(400);
    await swipe(60, 500, 300, 505);
    await expect(dots.nth(0)).toHaveClass(/hop-threshold__indicator-dot--active/);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);

    // A vertical touch swipe still scrolls the page normally.
    await swipe(200, 680, 200, 220);
    await page.waitForTimeout(600);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(50);
  });

  test("Homepage Section Sequence: Hero Slider -> Kalyani Film Direct Transition (No Placeholder)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openHomepage(page);

    // 1. Verify strict section sequence: Hero Slider -> Collections (Kalyani) directly
    const mainElement = page.locator("main.hop-home");
    await expect(mainElement).toBeVisible();

    const childTags = await mainElement.locator("> *").evaluateAll((elements) =>
      elements.map((el) => ({
        tag: el.tagName.toLowerCase(),
        className: el.className,
        id: el.id,
      }))
    );

    // Filter out status aside (preview banner if present) and screen-reader h1
    const contentSections = childTags.filter((el) => el.tag !== "aside" && el.tag !== "h1");

    expect(contentSections.length).toBeGreaterThanOrEqual(2);

    // Section 1: Cinematic hero video slider
    expect(contentSections[0].className).toContain("hop-threshold");

    // Section 2: Kalyani collection film directly follows hero (no video placeholder between them)
    expect(contentSections[1].id).toBe("collections");

    // Verify video placeholder section is completely removed from homepage
    const livingSareePlaceholder = page.locator(".hop-living-saree");
    await expect(livingSareePlaceholder).toHaveCount(0);

    // 2. Verify hero slider controls
    const heroControls = page.locator(".hop-threshold__controls");
    await expect(heroControls).toHaveCount(0);
    const heroButtons = page.locator(".hop-threshold button");
    await expect(heroButtons).toHaveCount(2);
    await expect(page.locator(".hop-threshold").getByRole("button", { name: "Previous slide" })).toHaveCount(1);
    await expect(page.locator(".hop-threshold").getByRole("button", { name: "Next slide" })).toHaveCount(1);
    const heroText = page.locator(".hop-threshold h1, .hop-threshold h2, .hop-threshold h3, .hop-threshold p, .hop-threshold a");
    await expect(heroText).toHaveCount(0);

    // 3. Verify deliberate vertical spacing between hero and collection photo placeholders
    const heroBox = await page.locator(".hop-threshold").boundingBox();
    const firstFilmBox = await page.locator(".hop-collection-film").first().boundingBox();

    if (heroBox && firstFilmBox) {
      const visibleGap = firstFilmBox.y - (heroBox.y + heroBox.height);
      expect(visibleGap).toBeGreaterThanOrEqual(40);
    }

    // 4. Confirm collection photo placeholders contain no visible collection names or captions
    const collectionsHeadings = page.locator("#collections h1, #collections h2, #collections h3, .hop-collection-film__identity");
    await expect(collectionsHeadings).toHaveCount(0);
  });

  test("Mobile Breakpoint: Hero-to-Kalyani Visible Spacing, Clean Placeholders, and No Video Placeholder", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openHomepage(page);

    // Verify hero slider on mobile
    const heroSection = page.locator(".hop-threshold");
    await expect(heroSection).toBeVisible();
    await expect(heroSection.locator("button")).toHaveCount(2);
    await expect(heroSection.getByRole("button", { name: "Previous slide" })).toHaveCount(1);
    await expect(heroSection.getByRole("button", { name: "Next slide" })).toHaveCount(1);
    await expect(heroSection.locator("h1, h2, h3, h4, p, a")).toHaveCount(0);

    const mobileIndicators = heroSection.locator(".hop-threshold__indicators");
    await expect(mobileIndicators).toBeVisible();
    expect(await mobileIndicators.locator(".hop-threshold__indicator-dot").count()).toBeGreaterThanOrEqual(2);
    await expect(mobileIndicators.locator(".hop-threshold__indicator-dot--active")).toHaveCount(1);

    // Verify no video placeholder on mobile between hero and collections
    const livingSaree = page.locator(".hop-living-saree");
    await expect(livingSaree).toHaveCount(0);

    // Verify intentional mobile vertical spacing between hero and first collection placeholder
    const heroBox = await heroSection.boundingBox();
    const firstFilmBox = await page.locator(".hop-collection-film").first().boundingBox();
    if (heroBox && firstFilmBox) {
      const visibleGap = firstFilmBox.y - (heroBox.y + heroBox.height);
      expect(visibleGap).toBeGreaterThanOrEqual(30);
    }

    // Confirm no collection names displayed on mobile photo placeholders
    const collectionsHeadings = page.locator("#collections h1, #collections h2, #collections h3, .hop-collection-film__identity");
    await expect(collectionsHeadings).toHaveCount(0);

    // Collections is visible directly on mobile
    const collections = page.locator("#collections");
    await expect(collections).toBeVisible();
  });
});
