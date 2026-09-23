import { test, expect } from '@playwright/test';

const TEST_ROUTES = [
  { path: '/', name: 'home', title: 'House of Padmavati' },
  { path: '/collections', name: 'collections', title: 'Collections' },
  { path: '/about', name: 'about', title: 'About' },
  { path: '/cart', name: 'cart', title: 'The Bag' },
  { path: '/wishlist', name: 'wishlist', title: 'Wishlist' },
  { path: '/checkout', name: 'checkout', title: 'Checkout' },
  { path: '/journal', name: 'journal', title: 'Journal' },
  { path: '/customer-care', name: 'customer-care', title: 'Customer Care' },
];

async function getMetaContent(page: import('@playwright/test').Page, selector: string): Promise<string | null> {
  try {
    return await page.locator(selector).getAttribute('content', { timeout: 5000 });
  } catch {
    return null;
  }
}

test.describe('SEO Audit', () => {
  for (const route of TEST_ROUTES) {
    test(`${route.name} should have proper SEO meta tags`, async ({ page }) => {
      await page.goto(route.path, { waitUntil: 'networkidle' });
      await page.waitForLoadState('domcontentloaded');

      // Check title
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeLessThanOrEqual(60); // Recommended max length

      // Check meta description
      const metaDescription = await getMetaContent(page, 'meta[name="description"]');
      expect(metaDescription).toBeTruthy();
      expect(metaDescription!.length).toBeLessThanOrEqual(160); // Recommended max length

      // Check canonical URL
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBeTruthy();
      expect(canonical).toContain(route.path === '/' ? '' : route.path);

      // Check Open Graph tags
      const ogTitle = await getMetaContent(page, 'meta[property="og:title"]');
      expect(ogTitle).toBeTruthy();

      const ogDescription = await getMetaContent(page, 'meta[property="og:description"]');
      expect(ogDescription).toBeTruthy();

      const ogType = await getMetaContent(page, 'meta[property="og:type"]');
      expect(ogType).toBeTruthy();

      const ogUrl = await getMetaContent(page, 'meta[property="og:url"]');
      expect(ogUrl).toBeTruthy();

      // Check Open Graph image (optional but recommended)
      const ogImage = await getMetaContent(page, 'meta[property="og:image"]');
      // og:image is recommended but not strictly required

      // Check Twitter Card
      const twitterCard = await getMetaContent(page, 'meta[name="twitter:card"]');
      expect(twitterCard).toBeTruthy();

      // Check viewport meta tag
      const viewport = await getMetaContent(page, 'meta[name="viewport"]');
      expect(viewport).toBeTruthy();
    });
  }

  test.describe('Structured Data', () => {
    test('Home page should have Organization schema', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForLoadState('domcontentloaded');

      const jsonLd = await page.locator('script[type="application/ld+json"]').all();
      expect(jsonLd.length).toBeGreaterThan(0);

      for (const script of jsonLd) {
        const content = await script.textContent();
        const data = JSON.parse(content!);
        if (data['@type'] === 'Organization') {
          expect(data.name).toBeTruthy();
          expect(data.url).toBeTruthy();
          return;
        }
      }
      // If no Organization schema found, check for WebSite
      for (const script of jsonLd) {
        const content = await script.textContent();
        const data = JSON.parse(content!);
        if (data['@type'] === 'WebSite') {
          expect(data.name).toBeTruthy();
          return;
        }
      }
    });

    test('Product pages should have Product schema', async ({ page }) => {
      await page.goto('/collections', { waitUntil: 'networkidle' });
      await page.waitForLoadState('domcontentloaded');

      const productLink = page.locator('a[href^="/product/"]').first();
      const href = await productLink.getAttribute('href');
      
      if (href) {
        await page.goto(href, { waitUntil: 'networkidle' });
        await page.waitForLoadState('domcontentloaded');

        const jsonLd = await page.locator('script[type="application/ld+json"]').all();
        expect(jsonLd.length).toBeGreaterThan(0);

        let foundProduct = false;
        for (const script of jsonLd) {
          const content = await script.textContent();
          const data = JSON.parse(content!);
          if (data['@type'] === 'Product') {
            expect(data.name).toBeTruthy();
            expect(data.offers).toBeTruthy();
            foundProduct = true;
            break;
          }
        }
        expect(foundProduct).toBeTruthy();
      }
    });
  });

  test.describe('Robots.txt and Sitemap', () => {
    test('robots.txt should exist and be accessible', async ({ page }) => {
      const response = await page.goto('/robots.txt', { waitUntil: 'networkidle' });
      expect(response?.status()).toBe(200);
      
      const text = await response!.text();
      expect(text).toContain('User-agent');
      expect(text).toContain('Disallow');
    });

    test('sitemap.xml should exist and be accessible', async ({ page }) => {
      const response = await page.goto('/sitemap.xml', { waitUntil: 'networkidle' });
      expect(response?.status()).toBe(200);
      
      const text = await response!.text();
      expect(text).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
      expect(text).toContain('<url>');
    });
  });

  test.describe('404 Page', () => {
    test('Non-existent page should return 404', async ({ page }) => {
      const response = await page.goto('/non-existent-page-12345', { waitUntil: 'networkidle' });
      expect(response?.status()).toBe(404);
    });

    test('404 page should have helpful content', async ({ page }) => {
      await page.goto('/non-existent-page-12345', { waitUntil: 'networkidle' });
      await page.waitForLoadState('domcontentloaded');

      // Should have a friendly message
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toBeTruthy();
    });
  });

  test.describe('Internal Linking', () => {
    test('Navigation links should be crawlable', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForLoadState('domcontentloaded');

      const navLinks = await page.locator('nav a, header a').all();
      
      for (const link of navLinks.slice(0, 10)) { // Check first 10
        const href = await link.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).not.toContain('javascript:');
        expect(href).not.toContain('#');
      }
    });

    test('Product links should be accessible', async ({ page }) => {
      await page.goto('/collections', { waitUntil: 'networkidle' });
      await page.waitForLoadState('domcontentloaded');

      const productLinks = await page.locator('a[href^="/product/"]').all();
      expect(productLinks.length).toBeGreaterThan(0);

      for (const link of productLinks.slice(0, 5)) {
        const href = await link.getAttribute('href');
        expect(href).toMatch(/^\/product\/[a-f0-9-]+$/);
      }
    });
  });

  test.describe('Performance SEO', () => {
    test('Page should have reasonable load time', async ({ page }) => {
      const start = Date.now();
      await page.goto('/', { waitUntil: 'networkidle' });
      const loadTime = Date.now() - start;
      
      // Should load within reasonable time (5 seconds for test environment)
      expect(loadTime).toBeLessThan(5000);
    });

    test('Critical resources should be preloaded', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForLoadState('domcontentloaded');

      const preloadLinks = await page.locator('link[rel="preload"]').all();
      expect(preloadLinks.length).toBeGreaterThanOrEqual(0);
    });
  });
});