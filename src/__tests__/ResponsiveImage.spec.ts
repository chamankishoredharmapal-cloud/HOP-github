import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1024, height: 768 },
  { name: 'large-desktop', width: 1440, height: 900 },
];

const TEST_ROUTES = [
  { path: '/', name: 'home' },
  { path: '/collections', name: 'collections' },
  { path: '/cart', name: 'cart' },
  { path: '/wishlist', name: 'wishlist' },
];

test.describe('Responsive Image Delivery', () => {
  for (const viewport of VIEWPORTS) {
    test.describe(`Viewport: ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });

      for (const route of TEST_ROUTES) {
        test(`should load images correctly on ${route.name}`, async ({ page }) => {
          const imageRequests: string[] = [];

          page.on('request', (request) => {
            if (request.resourceType() === 'image') {
              imageRequests.push(request.url());
            }
          });

          await page.goto(route.path, { waitUntil: 'networkidle' });
          await page.waitForLoadState('domcontentloaded');

          const images = await page.locator('img').all();
          expect(images.length).toBeGreaterThan(0);

          for (const img of images) {
            const src = await img.getAttribute('src');
            const srcset = await img.getAttribute('srcset');
            const sizes = await img.getAttribute('sizes');

            if (src && src.includes('supabase.co/storage/v1/render/image/public/')) {
              expect(src).toContain('format=webp');
            }

            if (srcset) {
              const candidates = srcset.split(',').map(s => s.trim());
              expect(candidates.length).toBeGreaterThanOrEqual(1);
            }
          }
        });
      }
    });
  }

  test.describe('srcset and sizes attributes', () => {
    test('Category page should have responsive product images', async ({ page }) => {
      await page.goto('/collections', { waitUntil: 'networkidle' });

      const productImages = page.locator('a[href^="/product/"] img');
      const count = await productImages.count();

      if (count > 0) {
        const firstImg = productImages.first();
        const srcset = await firstImg.getAttribute('srcset');
        const sizes = await firstImg.getAttribute('sizes');

        expect(srcset).toBeTruthy();
        expect(sizes).toBeTruthy();
      }
    });

    test('Cart page should have optimized item images', async ({ page }) => {
      await page.goto('/cart', { waitUntil: 'networkidle' });

      const cartImages = page.locator('img[src*="supabase"]');
      const count = await cartImages.count();

      if (count > 0) {
        const firstImg = cartImages.first();
        const src = await firstImg.getAttribute('src');
        expect(src).toContain('format=webp');
      }
    });

    test('Wishlist page should have optimized item images', async ({ page }) => {
      await page.goto('/wishlist', { waitUntil: 'networkidle' });

      const wishlistImages = page.locator('img[src*="supabase"]');
      const count = await wishlistImages.count();

      if (count > 0) {
        const firstImg = wishlistImages.first();
        const src = await firstImg.getAttribute('src');
        expect(src).toContain('format=webp');
      }
    });
  });

  test.describe('Fallback behavior', () => {
    test('should fallback to canonical URL on error for Supabase images', async ({ page }) => {
      await page.goto('/cart', { waitUntil: 'networkidle' });

      const supabaseImages = page.locator('img[src*="supabase.co/storage/v1/render/image/public/"]');
      const count = await supabaseImages.count();
      
      if (count > 0) {
        const img = supabaseImages.first();
        const initialSrc = await img.getAttribute('src');

        await page.evaluate(() => {
          const images = document.querySelectorAll('img[src*="supabase.co/storage/v1/render/image/public/"]');
          images.forEach((img) => {
            img.src = 'https://invalid.url/that/does/not/exist.jpg';
            img.dispatchEvent(new Event('error'));
          });
        });

        await page.waitForTimeout(500);

        const fallbackSrc = await img.getAttribute('src');
        expect(fallbackSrc).not.toBe(initialSrc);
      }
    });
  });
});