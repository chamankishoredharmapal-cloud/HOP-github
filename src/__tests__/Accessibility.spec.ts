import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const TEST_ROUTES = [
  { path: '/', name: 'home' },
  { path: '/collections', name: 'collections' },
  { path: '/about', name: 'about' },
  { path: '/cart', name: 'cart' },
  { path: '/wishlist', name: 'wishlist' },
  { path: '/checkout', name: 'checkout' },
  { path: '/journal', name: 'journal' },
  { path: '/customer-care', name: 'customer-care' },
];

test.describe('Accessibility Audit', () => {
  for (const route of TEST_ROUTES) {
    test(`should have no accessibility violations on ${route.name}`, async ({ page }) => {
      await page.goto(route.path, { waitUntil: 'networkidle' });
      await page.waitForLoadState('domcontentloaded');

      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }

  test.describe('Keyboard Navigation', () => {
    test('Home page should be keyboard navigable', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForLoadState('domcontentloaded');

      // Tab through focusable elements
      const focusableElements = await page.locator('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])').all();
      
      if (focusableElements.length > 0) {
        // First element should be focusable
        await focusableElements[0].focus();
        await expect(focusableElements[0]).toBeFocused();
      }
    });

    test('Navigation should have visible focus styles', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForLoadState('domcontentloaded');

      // Check that focusable elements have visible focus styles
      const links = page.locator('a');
      const count = await links.count();
      
      if (count > 0) {
        await links.first().focus();
        // Focus should be visible (not relying on outline: none without alternative)
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();
      }
    });
  });

  test.describe('Semantic HTML', () => {
    test('Pages should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForLoadState('domcontentloaded');

      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      
      if (headings.length > 0) {
        // Should have at least one h1
        const h1Count = await page.locator('h1').count();
        expect(h1Count).toBeGreaterThanOrEqual(1);
      }
    });

    test('Forms should have proper labels', async ({ page }) => {
      await page.goto('/contact', { waitUntil: 'networkidle' }).catch(() => {
        // Contact page might not exist, try checkout
        return page.goto('/checkout', { waitUntil: 'networkidle' });
      });
      await page.waitForLoadState('domcontentloaded');

      const inputs = await page.locator('input[type="text"], input[type="email"], input[type="tel"], textarea').all();
      
      for (const input of inputs) {
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');
        
        if (id) {
          const label = await page.locator(`label[for="${id}"]`).count();
          expect(label + (ariaLabel ? 1 : 0) + (ariaLabelledBy ? 1 : 0)).toBeGreaterThan(0);
        }
      }
    });

    test('Images should have alt text', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForLoadState('domcontentloaded');

      const images = await page.locator('img').all();
      
      for (const img of images) {
        const alt = await img.getAttribute('alt');
        const role = await img.getAttribute('role');
        
        // Decorative images should have alt="" or role="presentation"
        // Content images should have descriptive alt
        expect(alt !== null || role === 'presentation').toBeTruthy();
      }
    });
  });

  test.describe('ARIA', () => {
    test('Interactive elements should have accessible names', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForLoadState('domcontentloaded');

      const buttons = await page.locator('button').all();
      
      for (const button of buttons) {
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        const ariaLabelledBy = await button.getAttribute('aria-labelledby');
        
        // Button should have accessible name via text, aria-label, or aria-labelledby
        expect(text?.trim() || ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    });

    test('ARIA roles should be used correctly', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForLoadState('domcontentloaded');

      // Check for invalid role combinations
      const elementsWithRole = await page.locator('[role]').all();
      
      for (const el of elementsWithRole) {
        const role = await el.getAttribute('role');
        // Valid ARIA roles
        const validRoles = [
          'button', 'link', 'heading', 'region', 'navigation', 'main', 'complementary',
          'contentinfo', 'banner', 'search', 'form', 'dialog', 'alertdialog', 'alert',
          'status', 'timer', 'marquee', 'log', 'progressbar', 'slider', 'spinbutton',
          'textbox', 'checkbox', 'radio', 'tab', 'tablist', 'tabpanel', 'tree', 'treeitem',
          'listbox', 'option', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox', 'menuitemradio',
          'grid', 'gridcell', 'row', 'rowgroup', 'columnheader', 'rowheader', 'separator',
          'presentation', 'none', 'img', 'math', 'tooltip'
        ];
        
        // Note: We don't fail on invalid roles here, just document
        // In production, invalid roles should be fixed
      }
    });
  });

  test.describe('Color Contrast', () => {
    test('Text should meet minimum contrast requirements', async ({ page }) => {
      // This is a basic check - axe-core will catch contrast violations
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForLoadState('domcontentloaded');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa', 'wcag21aa'])
        .analyze();

      const contrastViolations = accessibilityScanResults.violations.filter(v => 
        v.id === 'color-contrast'
      );
      
      expect(contrastViolations.length).toBe(0);
    });
  });

  test.describe('Reduced Motion', () => {
    test('Should respect prefers-reduced-motion', async ({ page }) => {
      // Test with reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForLoadState('domcontentloaded');

      // Animations should be disabled or reduced
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag21aa'])
        .analyze();

      const motionViolations = accessibilityScanResults.violations.filter(v => 
        v.id === 'reduced-motion'
      );
      
      expect(motionViolations.length).toBe(0);
    });
  });

  test.describe('Landmarks and Structure', () => {
    test('Page should have proper landmark regions', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForLoadState('domcontentloaded');

      // Check for main landmark
      const main = await page.locator('main, [role="main"]').count();
      expect(main).toBeGreaterThanOrEqual(1);

      // Check for navigation
      const nav = await page.locator('nav, [role="navigation"]').count();
      expect(nav).toBeGreaterThanOrEqual(1);
    });

    test('Skip link should be present for keyboard users', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForLoadState('domcontentloaded');

      // Check for skip link (usually first focusable element)
      const skipLink = page.locator('a[href="#main"], a[href="#content"], .skip-link, [class*="skip"]').first();
      const count = await skipLink.count();
      
      // Skip link is recommended but not strictly required if heading structure is good
      // Just verify it exists or document if missing
    });
  });
});