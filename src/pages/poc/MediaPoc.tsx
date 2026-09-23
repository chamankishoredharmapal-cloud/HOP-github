/**
 * Phase 3 — Media Integration POC Test Page
 *
 * This page is a controlled proof-of-concept that demonstrates
 * optimized media delivery for three representative HOP assets:
 *
 *   A. hero-image.png (hero profile, above-the-fold)
 *   B. organic-earring.png (product profile, responsive)
 *   C. hop-fabric.jpg (editorial profile, lazy-loaded)
 *
 * This page is NOT a production page. It exists solely to validate
 * the OptimizedImage architecture before application-wide migration.
 *
 * Route: /poc/media (added temporarily for testing)
 */

import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { FeaturedProducts } from "@/components/hop/FeaturedProducts";
import heroImageSrc from "@/assets/hero-image.png";
import organicEarringSrc from "@/assets/organic-earring.png";
import fabricSrc from "@/assets/hop-fabric.jpg";

const MediaPoc = () => {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
      <header style={{ marginBottom: "3rem", borderBottom: "1px solid #e5e5e5", paddingBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 400, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Phase 3 — Media Integration POC
        </h1>
        <p style={{ color: "#666", fontSize: "0.875rem", marginTop: "0.5rem" }}>
          Three-asset proof-of-concept. Inspect the Network tab to verify AVIF/WebP delivery.
        </p>
      </header>

      {/* ─── POC A: HERO ─── */}
      <section style={{ marginBottom: "4rem" }}>
        <h2 style={{ fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#888", marginBottom: "1rem" }}>
          POC A — Hero (Above-the-Fold)
        </h2>
        <p style={{ fontSize: "0.75rem", color: "#999", marginBottom: "0.5rem" }}>
          <code>src/assets/hero-image.png</code> · 1824×1216 · hero profile · loading="eager" fetchpriority="high"
        </p>
        <div style={{ width: "min(92vw, 1680px)", margin: "0 auto", borderRadius: "0.5rem", overflow: "hidden" }}>
          <OptimizedImage
            assetPath="src/assets/hero-image.png"
            fallbackSrc={heroImageSrc}
            alt="House of Padmavati — hero composition"
            sizes="min(92vw, 1680px)"
            priority={true}
            imgClassName="w-full h-auto object-cover"
          />
        </div>
        <details style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#666" }}>
          <summary>Derivative manifest</summary>
          <pre style={{ background: "#f8f8f8", padding: "1rem", borderRadius: "0.25rem", overflow: "auto" }}>
{`AVIF srcset:
  /optimized/hero-image/hero-image-1200w.avif 1200w
  /optimized/hero-image/hero-image-1600w.avif 1600w
  /optimized/hero-image/hero-image-1824w.avif 1824w

WebP srcset:
  /optimized/hero-image/hero-image-1200w.webp 1200w
  /optimized/hero-image/hero-image-1600w.webp 1600w
  /optimized/hero-image/hero-image-1824w.webp 1824w

Fallback: original hero-image.png (2,786,827 bytes)

Source dimensions: 1824×1216 (aspect ratio: 3:2)
loading="eager" | fetchpriority="high" | decoding="async"`}
          </pre>
        </details>
      </section>

      {/* ─── POC B: PRODUCT ─── */}
      <section style={{ marginBottom: "4rem" }}>
        <h2 style={{ fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#888", marginBottom: "1rem" }}>
          POC B — Product (Responsive)
        </h2>
        <p style={{ fontSize: "0.75rem", color: "#999", marginBottom: "0.5rem" }}>
          <code>src/assets/organic-earring.png</code> · 1024×1024 · product profile · responsive delivery
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {/* Desktop-scale rendering */}
          <div>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#aaa", marginBottom: "0.5rem" }}>
              Desktop context (~50vw)
            </p>
            <div style={{ borderRadius: "0.375rem", overflow: "hidden", background: "#faf9f7" }}>
              <OptimizedImage
                assetPath="src/assets/organic-earring.png"
                fallbackSrc={organicEarringSrc}
                alt="Organic Earring — handcrafted jewelry detail"
                sizes="(max-width: 768px) 100vw, 50vw"
                imgClassName="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Thumbnail-scale rendering */}
          <div>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#aaa", marginBottom: "0.5rem" }}>
              Thumbnail context (~240px)
            </p>
            <div style={{ width: "240px", borderRadius: "0.375rem", overflow: "hidden", background: "#faf9f7" }}>
              <OptimizedImage
                assetPath="src/assets/organic-earring.png"
                fallbackSrc={organicEarringSrc}
                alt="Organic Earring — thumbnail"
                sizes="240px"
                imgClassName="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        <details style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#666" }}>
          <summary>Derivative manifest</summary>
          <pre style={{ background: "#f8f8f8", padding: "1rem", borderRadius: "0.25rem", overflow: "auto" }}>
{`AVIF srcset:
  /optimized/organic-earring/organic-earring-480w.avif 480w
  /optimized/organic-earring/organic-earring-800w.avif 800w
  /optimized/organic-earring/organic-earring-1024w.avif 1024w

WebP srcset:
  /optimized/organic-earring/organic-earring-480w.webp 480w
  /optimized/organic-earring/organic-earring-800w.webp 800w
  /optimized/organic-earring/organic-earring-1024w.webp 1024w

Fallback: original organic-earring.png (1,605,142 bytes)

Source dimensions: 1024×1024 (aspect ratio: 1:1)
loading="lazy" | decoding="async"`}
          </pre>
        </details>
      </section>

      {/* ─── POC C: EDITORIAL ─── */}
      <section style={{ marginBottom: "4rem" }}>
        <h2 style={{ fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#888", marginBottom: "1rem" }}>
          POC C — Editorial (hop-fabric.jpg)
        </h2>
        <p style={{ fontSize: "0.75rem", color: "#999", marginBottom: "0.5rem" }}>
          <code>src/assets/hop-fabric.jpg</code> · 1080×1920 · editorial profile · Selected because it is actively referenced in FeaturedProducts.ts, JournalPreview.tsx, and journalArticles.ts
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          <div>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#aaa", marginBottom: "0.5rem" }}>
              Journal article card (~33vw)
            </p>
            <div style={{ borderRadius: "0.375rem", overflow: "hidden", background: "#faf9f7", aspectRatio: "5/4" }}>
              <OptimizedImage
                assetPath="src/assets/hop-fabric.jpg"
                fallbackSrc={fabricSrc}
                alt="How morning light reads a weave — fabric texture detail"
                sizes="(max-width: 768px) 100vw, 33vw"
                imgClassName="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#aaa", marginBottom: "0.5rem" }}>
              Full-width editorial
            </p>
            <div style={{ borderRadius: "0.375rem", overflow: "hidden", background: "#faf9f7", maxHeight: "500px" }}>
              <OptimizedImage
                assetPath="src/assets/hop-fabric.jpg"
                fallbackSrc={fabricSrc}
                alt="HOP fabric weave — editorial detail"
                sizes="100vw"
                imgClassName="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <details style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#666" }}>
          <summary>Derivative manifest</summary>
          <pre style={{ background: "#f8f8f8", padding: "1rem", borderRadius: "0.25rem", overflow: "auto" }}>
{`AVIF srcset:
  /optimized/hop-fabric/hop-fabric-768w.avif 768w
  /optimized/hop-fabric/hop-fabric-1080w.avif 1080w

WebP srcset:
  /optimized/hop-fabric/hop-fabric-768w.webp 768w
  /optimized/hop-fabric/hop-fabric-1080w.webp 1080w

Fallback: original hop-fabric.jpg (262,800 bytes)

Source dimensions: 1080×1920 (aspect ratio: 9:16)
loading="lazy" | decoding="async"`}
          </pre>
        </details>
      </section>

      {/* ─── PATTERN 1: STATIC CATALOG ASSETS (FeaturedProducts) ─── */}
      <section style={{ marginBottom: "4rem" }}>
        <h2 style={{ fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#888", marginBottom: "1rem" }}>
          Pattern 1 — Static ESM &amp; Catalog Assets (FeaturedProducts)
        </h2>
        <p style={{ fontSize: "0.75rem", color: "#999", marginBottom: "1rem" }}>
          6 Catalog Assets: <code>hop-collection-pattu.jpg</code>, <code>hop-hero.jpg</code>, <code>hop-collection-linen.jpg</code>, <code>hop-fabric.jpg</code>, <code>hop-collection-organza.jpg</code>, <code>hop-gift.jpg</code> rendered via <code>&lt;OptimizedImage /&gt;</code> in responsive grid.
        </p>
        <div style={{ border: "1px solid #e5e5e5", borderRadius: "0.5rem", overflow: "hidden" }}>
          <FeaturedProducts />
        </div>
      </section>

      {/* ─── ARCHITECTURE NOTES ─── */}
      <footer style={{ borderTop: "1px solid #e5e5e5", paddingTop: "2rem", fontSize: "0.75rem", color: "#888" }}>
        <h2 style={{ fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1rem" }}>
          Architecture Notes
        </h2>
        <ul style={{ lineHeight: 2 }}>
          <li>Format negotiation: browser-native via <code>&lt;picture&gt;</code> + <code>&lt;source&gt;</code></li>
          <li>No JavaScript format detection</li>
          <li>Manifest resolver: <code>src/lib/mediaManifest.ts</code></li>
          <li>Component: <code>src/components/ui/OptimizedImage.tsx</code></li>
          <li>Derivatives served from: <code>public/optimized/</code></li>
          <li>Source assets: <strong>IMMUTABLE</strong> — originals in <code>src/assets/</code> unchanged</li>
          <li>CLS prevention: explicit <code>width</code>/<code>height</code> on <code>&lt;img&gt;</code></li>
        </ul>
      </footer>
    </div>
  );
};

export default MediaPoc;
