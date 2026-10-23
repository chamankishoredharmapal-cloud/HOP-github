import { test, expect, type Page } from "@playwright/test";

const HOMEPAGE_URL = "http://localhost:8080/";

const openHomepage = async (page: Page) => {
  const sectionsLoaded = page
    .waitForResponse(
      (response) => response.url().includes("get_published_site_sections"),
      { timeout: 15000 },
    )
    .catch(() => null);
  await page.goto(HOMEPAGE_URL, { waitUntil: "domcontentloaded" });
  await sectionsLoaded;
  await page.waitForTimeout(150);
};

test.describe("HOP Video Optimization & Smooth Playback Suite", () => {
  test("Desktop: Hero video loads 720p, autoplays, pauses on scroll out, resumes on scroll back", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openHomepage(page);

    // 1. Check Hero Section Video Element
    const heroSection = page.locator(".hop-threshold");
    await expect(heroSection).toBeVisible();

    const heroVideo = heroSection.locator("video").first();
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
    await openHomepage(page);

    const heroSection = page.locator(".hop-threshold");
    await expect(heroSection).toBeVisible();

    const heroVideo = heroSection.locator("video").first();
    await expect(heroVideo).toBeVisible({ timeout: 10000 });

    const mobileSource = heroVideo.locator('source[media="(max-width: 767px)"]');
    await expect(mobileSource).toHaveCount(1);

    const mobileSrc = await mobileSource.getAttribute("src");
    expect(mobileSrc).toMatch(/-(540p)\.mp4/);
  });

  test("Collection Films: Only mount and play on viewport entry", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openHomepage(page);

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
    await openHomepage(page);

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

    // Incoming video should be playing.
    await page.waitForFunction(() => {
      const v = document.querySelector(".hop-threshold .hop-threshold__slide--active video") as HTMLVideoElement;
      return v && !v.paused;
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

  test("Homepage Section Sequence: Hero Slider -> Living Saree Placeholder -> Kalyani Film", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openHomepage(page);

    // 1. Verify exact sequence of top 3 sections
    const mainChildren = page.locator("main.hop-home > *");
    const childTags = await mainChildren.evaluateAll((elements) =>
      elements.map((el) => ({
        tag: el.tagName.toLowerCase(),
        className: el.className,
        id: el.id,
      }))
    );

    // Filter out status aside (preview banner if present) and screen-reader h1
    const contentSections = childTags.filter((el) => el.tag !== "aside" && el.tag !== "h1");

    expect(contentSections.length).toBeGreaterThanOrEqual(3);

    // Section 1: Cinematic hero video slider
    expect(contentSections[0].className).toContain("hop-threshold");

    // Section 2: Living Saree full-width video placeholder immediately below
    expect(contentSections[1].className).toContain("hop-living-saree");

    // Section 3: Kalyani collection film immediately below
    expect(contentSections[2].id).toBe("collections");

    // 2. Living Saree 16:9 landscape ratio verification on desktop
    const livingSaree = page.locator(".hop-living-saree");
    const livingSareeFrame = livingSaree.locator(".hop-living-saree__frame");
    await expect(livingSaree).toBeVisible();
    await expect(livingSareeFrame).toBeVisible();

    const frameBox = await livingSareeFrame.boundingBox();
    expect(frameBox).not.toBeNull();
    if (frameBox) {
      const ratio = frameBox.width / frameBox.height;
      // 16 / 9 = ~1.7778
      expect(Math.abs(ratio - 16 / 9)).toBeLessThan(0.05);
    }

    // 3. Living Saree must be completely empty: no text, captions, overlays, labels, borders, or placeholder content
    const livingSareeButtons = livingSaree.locator("button");
    await expect(livingSareeButtons).toHaveCount(0);

    const livingSareeText = livingSaree.locator("h1, h2, h3, h4, h5, h6, p, span, a, label");
    await expect(livingSareeText).toHaveCount(0);

    // No placeholder image when no video is configured
    const livingSareeImages = livingSaree.locator("img");
    await expect(livingSareeImages).toHaveCount(0);

    // 4. Verify hero slider has only the two edge arrows and zero text
    const heroControls = page.locator(".hop-threshold__controls");
    await expect(heroControls).toHaveCount(0);
    const heroButtons = page.locator(".hop-threshold button");
    await expect(heroButtons).toHaveCount(2);
    await expect(page.locator(".hop-threshold").getByRole("button", { name: "Previous slide" })).toHaveCount(1);
    await expect(page.locator(".hop-threshold").getByRole("button", { name: "Next slide" })).toHaveCount(1);
    const heroText = page.locator(".hop-threshold h1, .hop-threshold h2, .hop-threshold h3, .hop-threshold p, .hop-threshold a");
    await expect(heroText).toHaveCount(0);

    // 5. Verify zero artificial margin between sections
    const heroBox = await page.locator(".hop-threshold").boundingBox();
    const livingSareeBox = await livingSaree.boundingBox();
    const collectionsBox = await page.locator("#collections").boundingBox();

    if (heroBox && livingSareeBox) {
      // The top of living saree touches the bottom of the hero slider
      const topGap = Math.abs(livingSareeBox.y - (heroBox.y + heroBox.height));
      expect(topGap).toBeLessThanOrEqual(2);
    }

    if (livingSareeBox && collectionsBox) {
      // The top of collections touches the bottom of living saree
      const bottomGap = Math.abs(collectionsBox.y - (livingSareeBox.y + livingSareeBox.height));
      expect(bottomGap).toBeLessThanOrEqual(2);
    }
  });

  test("Living Saree Mobile 16:9 Landscape Ratio & Clean Visual Frame", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openHomepage(page);

    // Verify hero slider on mobile contains dot indicators, centered, with 4 dots and 1 active dot
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

    const livingSaree = page.locator(".hop-living-saree");
    const livingSareeFrame = livingSaree.locator(".hop-living-saree__frame");
    await expect(livingSaree).toBeVisible();
    await expect(livingSareeFrame).toBeVisible();

    // Verify 16:9 ratio on mobile
    const frameBox = await livingSareeFrame.boundingBox();
    expect(frameBox).not.toBeNull();
    if (frameBox) {
      const ratio = frameBox.width / frameBox.height;
      expect(Math.abs(ratio - 16 / 9)).toBeLessThan(0.05);
    }

    // Verify clean visual frame with zero controls or text on mobile
    await expect(livingSaree.locator("button")).toHaveCount(0);
    await expect(livingSaree.locator("h1, h2, h3, h4, p, span, a")).toHaveCount(0);
    await expect(livingSaree.locator("img")).toHaveCount(0);

    // Verify flush spacing on mobile
    const heroBox = await page.locator(".hop-threshold").boundingBox();
    const livingSareeBox = await livingSaree.boundingBox();
    const collectionsBox = await page.locator("#collections").boundingBox();

    if (heroBox && livingSareeBox) {
      const topGap = Math.abs(livingSareeBox.y - (heroBox.y + heroBox.height));
      expect(topGap).toBeLessThanOrEqual(2);
    }

    if (livingSareeBox && collectionsBox) {
      const bottomGap = Math.abs(collectionsBox.y - (livingSareeBox.y + livingSareeBox.height));
      expect(bottomGap).toBeLessThanOrEqual(2);
    }
  });
});
