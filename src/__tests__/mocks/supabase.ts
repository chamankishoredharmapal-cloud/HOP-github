import type { Page } from "@playwright/test";

const SUPABASE_REST = "**/rest/v1/**";

export const MOCK_COLLECTIONS = [
  {
    id: "col-kalyani",
    name: "Kalyani",
    slug: "kalyani",
    hero_image_url: "https://placehold.co/800x600/jasmine/teal?text=Kalyani",
    hero_video_url: null,
    editorial_story: "Inspired by the coastal blossom of Tamil Nadu.",
    tagline: "Coastal Weaves",
    description: "Handwoven pattu sarees from the heart of Kanchipuram.",
    display_order: 1,
    featured_on_homepage: true,
    status: "published",
  },
  {
    id: "col-viara",
    name: "Viara",
    slug: "viara",
    hero_image_url: "https://placehold.co/800x600/sand/ink?text=Viara",
    hero_video_url: null,
    editorial_story: "Contemporary silhouettes for the modern woman.",
    tagline: "Modern Luxe",
    description: "Reception-ready silk sarees with contemporary motifs.",
    display_order: 2,
    featured_on_homepage: false,
    status: "published",
  },
];

export const MOCK_PRODUCTS = [
  {
    id: "prod-padmini",
    name: "Padmini · Coastal Pattu",
    slug: "padmini-coastal-pattu",
    story: "A handwoven pattu saree in deep teal with gold zari borders.",
    short_description: "Pure Mulberry Silk · Kanchipuram",
    customer_description: "A stunning teal pattu with traditional gold zari work.",
    selling_price: 4800000,
    mrp: 5200000,
    fabric: "Pure Mulberry Silk",
    weave: "Handloom Pattu",
    colour: "Teal",
    occasion: "Wedding",
    length: "5.5m",
    weight: "750g",
    blouse_included: true,
    care_instructions: "Dry clean only. Store in a muslin cloth.",
    country_of_origin: "India",
    estimated_dispatch_days: 7,
    collection_id: "col-kalyani",
    featured: true,
    status: "published",
    stock: 5,
    collections: { slug: "kalyani", name: "Kalyani" },
  },
  {
    id: "prod-megham",
    name: "Megham · Twilight Linen",
    slug: "megham-twilight-linen",
    story: "A lightweight linen saree in twilight grey with handwoven texture.",
    short_description: "Pure Linen · Handwoven",
    customer_description: "Perfect for evening gatherings.",
    selling_price: 1420000,
    mrp: 1600000,
    fabric: "Pure Linen",
    weave: "Handloom",
    colour: "Grey",
    occasion: "Casual",
    length: "5.5m",
    weight: "450g",
    blouse_included: false,
    care_instructions: "Gentle hand wash. Iron while damp.",
    country_of_origin: "India",
    estimated_dispatch_days: 5,
    collection_id: "col-kalyani",
    featured: true,
    status: "published",
    stock: 8,
    collections: { slug: "kalyani", name: "Kalyani" },
  },
  {
    id: "prod-viara-silk",
    name: "Viara · Reception Silk",
    slug: "viara-reception-silk",
    story: "A contemporary silk saree with minimalist gold motifs.",
    short_description: "Pure Silk · Contemporary",
    customer_description: "Reception-ready elegance.",
    selling_price: 6400000,
    mrp: 7000000,
    fabric: "Pure Silk",
    weave: "Contemporary",
    colour: "Blush Pink",
    occasion: "Reception",
    length: "5.5m",
    weight: "650g",
    blouse_included: true,
    care_instructions: "Dry clean only.",
    country_of_origin: "India",
    estimated_dispatch_days: 10,
    collection_id: "col-viara",
    featured: false,
    status: "published",
    stock: 3,
    collections: { slug: "viara", name: "Viara" },
  },
  {
    id: "prod-sakura",
    name: "Sakura · Organza Drift",
    slug: "sakura-organza-drift",
    story: "An airy organza saree with hand-embroidered floral motifs.",
    short_description: "Pure Organza · Hand-embroidered",
    customer_description: "Light as a petal, rich in detail.",
    selling_price: 2250000,
    mrp: 2600000,
    fabric: "Pure Organza",
    weave: "Hand-embroidered",
    colour: "Ivory",
    occasion: "Festival",
    length: "5.5m",
    weight: "350g",
    blouse_included: true,
    care_instructions: "Dry clean only. Handle with care.",
    country_of_origin: "India",
    estimated_dispatch_days: 14,
    collection_id: "col-viara",
    featured: false,
    status: "published",
    stock: 0,
    collections: { slug: "viara", name: "Viara" },
  },
];

export const MOCK_IMAGES = [
  { id: "img-pa-1", product_id: "prod-padmini", url: "https://placehold.co/800x1000/jasmine/teal?text=Padmini+1", alt_text: null, sort_order: 0, is_primary: true },
  { id: "img-pa-2", product_id: "prod-padmini", url: "https://placehold.co/800x1000/sand/ink?text=Padmini+2", alt_text: null, sort_order: 1, is_primary: false },
  { id: "img-pa-3", product_id: "prod-padmini", url: "https://placehold.co/800x1000/teal/jasmine?text=Padmini+3", alt_text: null, sort_order: 2, is_primary: false },
  { id: "img-pa-4", product_id: "prod-padmini", url: "https://placehold.co/800x1000/sakura/ink?text=Padmini+4", alt_text: null, sort_order: 3, is_primary: false },
  { id: "img-me-1", product_id: "prod-megham", url: "https://placehold.co/800x1000/grey/white?text=Megham+1", alt_text: null, sort_order: 0, is_primary: true },
  { id: "img-me-2", product_id: "prod-megham", url: "https://placehold.co/800x1000/sand/ink?text=Megham+2", alt_text: null, sort_order: 1, is_primary: false },
  { id: "img-vi-1", product_id: "prod-viara-silk", url: "https://placehold.co/800x1000/pink/white?text=Viara+1", alt_text: null, sort_order: 0, is_primary: true },
  { id: "img-vi-2", product_id: "prod-viara-silk", url: "https://placehold.co/800x1000/jasmine/ink?text=Viara+2", alt_text: null, sort_order: 1, is_primary: false },
  { id: "img-vi-3", product_id: "prod-viara-silk", url: "https://placehold.co/800x1000/teal/jasmine?text=Viara+3", alt_text: null, sort_order: 2, is_primary: false },
  { id: "img-sa-1", product_id: "prod-sakura", url: "https://placehold.co/800x1000/ivory/ink?text=Sakura+1", alt_text: null, sort_order: 0, is_primary: true },
];

function extractParam(url: URL, name: string): string | null {
  return url.searchParams.get(name);
}

function hasFilter(url: URL, field: string, operator: string): string | null {
  const val = url.searchParams.get(field);
  if (val && val.startsWith(`${operator}.`)) return val.slice(operator.length + 1);
  return null;
}

function getAcceptHeader(route: Parameters<Parameters<Page['route']>[1]>[0]): string {
  return route.request().headers()["accept"] ?? "";
}

function isSingleResult(route: Parameters<Parameters<Page['route']>[1]>[0]): boolean {
  return getAcceptHeader(route).includes("vnd.pgrst.object");
}

function buildResponse(data: unknown, single: boolean) {
  if (single) {
    if (Array.isArray(data) && data.length === 0) return { status: 404, contentType: "application/json", body: JSON.stringify({ code: "PGRST116", message: "Not found" }) };
    if (Array.isArray(data)) return { status: 200, contentType: "application/json", body: JSON.stringify(data[0] ?? null) };
    return { status: 200, contentType: "application/json", body: JSON.stringify(data) };
  }
  return { status: 200, contentType: "application/json", body: JSON.stringify(Array.isArray(data) ? data : [data]) };
}

type RouteHandler = Parameters<Parameters<Page['route']>[1]>[0];

function applyFilters(items: Record<string, unknown>[], url: URL): Record<string, unknown>[] {
  let filtered = [...items];
  for (const [key, value] of url.searchParams.entries()) {
    if (value.startsWith("eq.")) {
      const target = value.slice(3);
      filtered = filtered.filter((item) => String(item[key]) === target);
    } else if (value.startsWith("neq.")) {
      const target = value.slice(4);
      filtered = filtered.filter((item) => String(item[key]) !== target);
    } else if (value.startsWith("in.")) {
      const inner = value.slice(3);
      if (inner.startsWith("(") && inner.endsWith(")")) {
        const targets = inner.slice(1, -1).split(",").map((s) => s.trim());
        filtered = filtered.filter((item) => targets.includes(String(item[key])));
      }
    }
  }
  return filtered;
}

function handleTable(route: RouteHandler, url: URL, tableName: string): boolean {
  if (tableName === "products") {
    let data: Record<string, unknown>[];
    const idFilter = hasFilter(url, "id", "eq");
    const collectionSlugFilter = hasFilter(url, "collections.slug", "eq");
    const collectionIdFilter = hasFilter(url, "collection_id", "eq");
    const statusFilter = hasFilter(url, "status", "eq");
    const limitParam = extractParam(url, "limit");
    const orderParam = extractParam(url, "order");

    data = MOCK_PRODUCTS.map((p) => ({ ...p }));

    if (statusFilter) data = data.filter((p) => p.status === statusFilter);
    if (idFilter) data = data.filter((p) => p.id === idFilter);

    const idInFilter = hasFilter(url, "id", "in");
    if (idInFilter) {
      const ids = idInFilter.slice(1, -1).split(",").map((s) => s.trim());
      data = data.filter((p) => ids.includes(p.id as string));
    }

    if (collectionIdFilter) data = data.filter((p) => p.collection_id === collectionIdFilter);
    if (collectionSlugFilter) {
      data = data.filter((p) => {
        const c = p.collections as { slug?: string; name?: string } | null;
        return c?.slug === collectionSlugFilter;
      });
    }

    if (hasFilter(url, "id", "neq")) {
      const excludeId = hasFilter(url, "id", "neq");
      if (excludeId) data = data.filter((p) => p.id !== excludeId);
    }

    if (limitParam) {
      const limit = parseInt(limitParam, 10);
      data = data.slice(0, limit);
    }

    if (orderParam) {
      const [field, dir] = orderParam.split(".");
      if (field && dir) {
        data.sort((a, b) => {
          const aVal = a[field] as number;
          const bVal = b[field] as number;
          return dir === "desc" ? bVal - aVal : aVal - bVal;
        });
      }
    }

    route.fulfill(buildResponse(data, isSingleResult(route)));
    return true;
  }

  if (tableName === "product_images") {
    let data = [...MOCK_IMAGES];

    const productIdFilter = hasFilter(url, "product_id", "eq");
    if (productIdFilter) data = data.filter((img) => img.product_id === productIdFilter);

    const productIdIn = hasFilter(url, "product_id", "in");
    if (productIdIn) {
      const ids = productIdIn.slice(1, -1).split(",").map((s) => s.trim());
      data = data.filter((img) => ids.includes(img.product_id));
    }

    const orderParam = extractParam(url, "order");
    if (orderParam && orderParam.startsWith("sort_order")) {
      data.sort((a, b) => a.sort_order - b.sort_order);
    }

    route.fulfill(buildResponse(data, isSingleResult(route)));
    return true;
  }

  if (tableName === "collections") {
    let data = MOCK_COLLECTIONS.map((c) => ({ ...c }));

    const slugFilter = hasFilter(url, "slug", "eq");
    if (slugFilter) data = data.filter((c) => c.slug === slugFilter);

    const featuredFilter = hasFilter(url, "featured_on_homepage", "eq");
    if (featuredFilter) data = data.filter((c) => String(c.featured_on_homepage) === featuredFilter);

    const statusFilter = hasFilter(url, "status", "eq");
    if (statusFilter) data = data.filter((c) => c.status === statusFilter);

    const orderParam = extractParam(url, "order");
    if (orderParam && orderParam.startsWith("display_order")) {
      data.sort((a, b) => a.display_order - b.display_order);
    }

    const limitParam = extractParam(url, "limit");
    if (limitParam) {
      const limit = parseInt(limitParam, 10);
      data = data.slice(0, limit);
    }

    route.fulfill(buildResponse(data, isSingleResult(route)));
    return true;
  }

  if (["orders", "customers", "shipping_addresses", "order_items", "payments"].includes(tableName)) {
    route.fulfill(buildResponse([], isSingleResult(route)));
    return true;
  }

  return false;
}

export async function setupSupabaseMocks(page: Page) {
  await page.route(SUPABASE_REST, async (route) => {
    const url = new URL(route.request().url());
    const pathParts = url.pathname.split("/").filter(Boolean);
    const tableName = pathParts[pathParts.length - 1];

    if (route.request().method() === "GET" && tableName) {
      if (handleTable(route, url, tableName)) return;
    }

    route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
  });

  await page.route("**/rest/v1/rpc/*", async (route) => {
    route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
  });

  await page.route("**/storage/v1/object/public/**", async (route) => {
    route.fulfill({ status: 200, contentType: "image/png", body: "" });
  });
}
