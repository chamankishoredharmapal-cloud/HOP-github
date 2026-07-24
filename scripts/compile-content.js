import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { load as yamlLoad, dump as yamlDump } from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "src/content");
const OUTPUT_DIR = path.join(ROOT, "src/data/__generated__");
const PUBLIC_DIR = path.join(ROOT, "public");
const MANIFEST_PATH = path.join(OUTPUT_DIR, ".manifest.json");

const CONTENT_TYPES = [
  { dir: "journal",    type: "journal",       importType: "JournalArticle" },
  { dir: "collections",type: "collection",     importType: "CollectionNarrative" },
  { dir: "products",   type: "product",        importType: "ProductStory" },
  { dir: "craft-notes",type: "craft-note",     importType: "CraftNote" },
  { dir: "weaver-portraits", type: "weaver-portrait", importType: "WeaverPortrait" },
  { dir: "field-notes",type: "field-note",     importType: "FieldNote" },
  { dir: "house-letters", type: "house-letter",importType: "HouseLetter" },
  { dir: "ritual-guides", type: "ritual-guide",importType: "RitualGuide" },
  { dir: "glossary",   type: "glossary",       importType: "GlossaryEntry" },
];

const BLOCK_BODY_TYPES = new Set(["intro", "body", "closure", "step", "system-2"]);
const BODY_ONLY_TYPES = new Set(["divider"]);

const FILE_HASH_CACHE = new Map();

function fileHash(filePath) {
  if (FILE_HASH_CACHE.has(filePath)) return FILE_HASH_CACHE.get(filePath);
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath);
  const hash = createHash("md5").update(content).digest("hex");
  FILE_HASH_CACHE.set(filePath, hash);
  return hash;
}

function loadManifest() {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function saveManifest(manifest) {
  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf-8");
}

function discoverContent() {
  const units = [];
  for (const ct of CONTENT_TYPES) {
    const typeDir = path.join(CONTENT_DIR, ct.dir);
    if (!fs.existsSync(typeDir)) continue;

    const rootIndex = path.join(typeDir, "index.md");
    if (fs.existsSync(rootIndex)) {
      units.push({
        type: ct.type,
        typeDir: ct.dir,
        slug: "index",
        dir: typeDir,
        indexPath: rootIndex,
        importType: ct.importType,
      });
    }

    const entries = fs.readdirSync(typeDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const indexPath = path.join(typeDir, entry.name, "index.md");
      if (!fs.existsSync(indexPath)) continue;
      units.push({
        type: ct.type,
        typeDir: ct.dir,
        slug: entry.name,
        dir: path.join(typeDir, entry.name),
        indexPath,
        importType: ct.importType,
      });
    }
  }
  return units;
}

function parseContent(filePath) {
  const text = fs.readFileSync(filePath, "utf-8");
  const lines = text.split("\n");

  if (lines[0].trim() !== "---") {
    throw new Error("Content must start with ---");
  }

  let fmEndLine = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      fmEndLine = i;
      break;
    }
  }
  if (fmEndLine === -1) {
    throw new Error("Frontmatter not closed");
  }

  const frontmatter = yamlLoad(lines.slice(1, fmEndLine).join("\n"));
  const remainingLines = lines.slice(fmEndLine + 1);

  const blocks = [];
  let i = 0;
  while (i < remainingLines.length) {
    if (remainingLines[i].trim() !== "---") {
      i++;
      continue;
    }
    const metaLines = [];
    i++;
    while (i < remainingLines.length && remainingLines[i].trim() !== "---") {
      metaLines.push(remainingLines[i]);
      i++;
    }
    let meta = metaLines.length > 0 ? yamlLoad(metaLines.join("\n")) : {};
    if (!meta || typeof meta !== "object") meta = {};

    i++;
    const bodyLines = [];
    while (i < remainingLines.length && remainingLines[i].trim() !== "---") {
      bodyLines.push(remainingLines[i]);
      i++;
    }
    const body = bodyLines.join("\n").trim();

    if (BLOCK_BODY_TYPES.has(meta.type)) {
      blocks.push({ ...meta, body });
    } else {
      blocks.push(meta);
    }
  }

  return { frontmatter, blocks };
}

function readSchema(typeName) {
  const schemaPath = path.join(CONTENT_DIR, "_schemas", `${typeName}.yaml`);
  if (!fs.existsSync(schemaPath)) return null;
  return yamlLoad(fs.readFileSync(schemaPath, "utf-8"));
}

function validateValue(value, fieldName, schema, errors, warnings) {
  if (schema.const !== undefined) {
    if (value !== schema.const) {
      errors.push(`'${fieldName}' must be '${schema.const}', got '${value}'`);
    }
    return;
  }

  if (schema.type === "string") {
    if (typeof value !== "string") {
      errors.push(`Expected string for '${fieldName}', got ${typeof value}`);
      return;
    }
    if (schema.enum && !schema.enum.includes(value)) {
      errors.push(`'${fieldName}' must be one of: ${schema.enum.join(", ")}. Got: '${value}'`);
    }
    if (schema.minLength != null && value.length < schema.minLength) {
      errors.push(`'${fieldName}' must be at least ${schema.minLength} characters`);
    }
    if (schema.maxLength != null && value.length > schema.maxLength) {
      warnings.push(`'${fieldName}' exceeds ${schema.maxLength} characters (${value.length})`);
    }
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
      errors.push(`'${fieldName}' does not match pattern ${schema.pattern}`);
    }
    if (schema.format === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      errors.push(`'${fieldName}' must be a valid date in YYYY-MM-DD format`);
    }
  } else if (schema.type === "integer") {
    if (!Number.isInteger(value)) {
      errors.push(`Expected integer for '${fieldName}', got ${typeof value} (${value})`);
      return;
    }
    if (schema.minimum != null && value < schema.minimum) {
      errors.push(`'${fieldName}' must be >= ${schema.minimum}`);
    }
    if (schema.maximum != null && value > schema.maximum) {
      errors.push(`'${fieldName}' must be <= ${schema.maximum}`);
    }
  } else if (schema.type === "array") {
    if (!Array.isArray(value)) {
      errors.push(`Expected array for '${fieldName}', got ${typeof value}`);
      return;
    }
    if (schema.items) {
      for (let idx = 0; idx < value.length; idx++) {
        validateValue(value[idx], `${fieldName}[${idx}]`, schema.items, errors, warnings);
      }
    }
  } else if (schema.type === "object") {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      errors.push(`Expected object for '${fieldName}', got ${typeof value}`);
      return;
    }
    if (schema.required) {
      for (const req of schema.required) {
        if (value[req] === undefined) {
          errors.push(`Missing required field '${fieldName}.${req}'`);
        }
      }
    }
    if (schema.properties) {
      for (const [key, val] of Object.entries(value)) {
        if (schema.properties[key]) {
          validateValue(val, `${fieldName}.${key}`, schema.properties[key], errors, warnings);
        }
      }
    }
  }
}

function validateFrontmatter(frontmatter, schema, unitPath) {
  const errors = [];
  const warnings = [];

  if (schema.required) {
    for (const req of schema.required) {
      if (frontmatter[req] === undefined) {
        errors.push(`Missing required field '${req}'`);
      }
    }
  }

  if (schema.properties && schema.type === "object") {
    for (const [key, val] of Object.entries(frontmatter)) {
      if (schema.properties[key]) {
        validateValue(val, key, schema.properties[key], errors, warnings);
      }
    }
  }

  return { errors, warnings };
}

function calculateReadingTime(frontmatter, blocks) {
  if (frontmatter.readingTime != null) {
    return frontmatter.readingTime;
  }
  const allText = blocks
    .map((b) => {
      const parts = [];
      for (const val of Object.values(b)) {
        if (typeof val === "string") parts.push(val);
      }
      return parts.join(" ");
    })
    .join(" ");
  const words = allText.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function hasAltInSchema(typeName) {
  const schema = readSchema(typeName);
  if (!schema || !schema.properties) return false;
  return schema.properties.alt !== undefined;
}

function validateImages(contentDir, frontmatter, unitId) {
  const errors = [];
  const warnings = [];
  if (frontmatter.hero) {
    const heroPath = path.resolve(contentDir, frontmatter.hero);
    if (!fs.existsSync(heroPath)) {
      errors.push({ unit: unitId, message: `Missing hero image: ${frontmatter.hero}` });
    }
  }
  return { errors, warnings };
}

function validateBlockImages(contentDir, blocks, unitId) {
  const errors = [];
  const warnings = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.type === "image" || block.type === "hero") {
      if (block.image) {
        const imgPath = path.resolve(contentDir, block.image);
        if (!fs.existsSync(imgPath)) {
          errors.push({ unit: unitId, message: `Missing image in block ${i}: ${block.image}` });
        }
      }
      if (!block.alt) {
        warnings.push({ unit: unitId, message: `Missing alt text in block ${i} (${block.type})` });
      }
    }
    if (block.type === "gallery" && block.images) {
      for (let j = 0; j < block.images.length; j++) {
        const imgPath = path.resolve(contentDir, block.images[j]);
        if (!fs.existsSync(imgPath)) {
          errors.push({ unit: unitId, message: `Missing gallery image in block ${i}, index ${j}: ${block.images[j]}` });
        }
      }
    }
    if (block.type === "video" && block.poster) {
      const posterPath = path.resolve(contentDir, block.poster);
      if (!fs.existsSync(posterPath)) {
        warnings.push({ unit: unitId, message: `Missing video poster in block ${i}: ${block.poster}` });
      }
    }
  }
  return { errors, warnings };
}

function copyHeroImage(contentDir, frontmatter, unitType, unitSlug) {
  if (!frontmatter.hero) return false;
  const srcPath = path.resolve(contentDir, frontmatter.hero);
  if (!fs.existsSync(srcPath)) return false;

  const destDir = path.join(PUBLIC_DIR, "content", unitType, unitSlug);
  const destPath = path.join(destDir, "hero.jpg");
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(srcPath, destPath);
  return true;
}

function resolveContentReferences(unit, allUnits) {
  const fm = unit.frontmatter;
  const result = {
    relatedProducts: [],
    relatedArticles: [],
    relatedCraftNotes: [],
    relatedCollections: [],
    glossaryTerms: [],
  };
  const errors = [];
  const warnings = [];

  if (fm.relatedProducts) {
    for (const uuid of fm.relatedProducts) {
      if (allUnits.some((u) => u.frontmatter.productId === uuid)) {
        result.relatedProducts.push(uuid);
      } else {
        warnings.push({ unit: unit.id, message: `Related product '${uuid}' not found` });
      }
    }
  }

  if (fm.relatedArticles) {
    for (const slug of fm.relatedArticles) {
      const found = allUnits.find(
        (u) => u.type === "journal" && u.slug === slug
      );
      if (found) {
        result.relatedArticles.push(slug);
      } else {
        errors.push({ unit: unit.id, message: `Related article '${slug}' not found` });
      }
    }
  }

  if (fm.glossaryTerms) {
    for (const slug of fm.glossaryTerms) {
      const found = allUnits.find(
        (u) => u.type === "glossary" && u.slug === slug
      );
      if (found) {
        result.glossaryTerms.push(slug);
      } else {
        warnings.push({ unit: unit.id, message: `Glossary term '${slug}' not found` });
      }
    }
  }

  if (fm.collections) {
    for (const slug of fm.collections) {
      const found = allUnits.find(
        (u) => u.type === "collection" && u.slug === slug
      );
      if (found) {
        result.relatedCollections.push(slug);
      } else {
        warnings.push({ unit: unit.id, message: `Collection '${slug}' not found` });
      }
    }
  }

  if (fm.products) {
    for (const uuid of fm.products) {
      if (allUnits.some((u) => u.frontmatter.productId === uuid)) {
        result.relatedProducts.push(uuid);
      }
    }
  }

  if (fm.relatedCraftNotes) {
    for (const slug of fm.relatedCraftNotes) {
      const found = allUnits.find(
        (u) => u.type === "craft-note" && u.slug === slug
      );
      if (found) {
        result.relatedCraftNotes.push(slug);
      } else {
        errors.push({ unit: unit.id, message: `Related craft note '${slug}' not found` });
      }
    }
  }

  return { result, errors, warnings };
}

function buildRelationshipGraph(allUnits) {
  const graph = {};
  for (const unit of allUnits) {
    const contentId = `${unit.type}/${unit.slug}`;
    graph[contentId] = { ...unit.relationships };
  }
  return graph;
}

const READING_TIME_TYPES = new Set(["journal", "craft-note"]);

function generateOutputContent(unit) {
  const { frontmatter, blocks, type } = unit;
  const entry = { ...frontmatter, body: blocks };
  if (READING_TIME_TYPES.has(type) && entry.readingTime == null) {
    entry.readingTime = calculateReadingTime(frontmatter, blocks);
  }
  return entry;
}

function serializeValue(val) {
  if (typeof val === "string") {
    const escaped = val
      .replace(/\\/g, "\\\\")
      .replace(/`/g, "\\`")
      .replace(/\$/g, "\\$");
    return `\`${escaped}\``;
  }
  if (val === null || val === undefined) return "undefined";
  if (Array.isArray(val)) {
    if (val.length === 0) return "[]";
    const items = val.map((v) => serializeValue(v));
    if (items.every((s) => !s.includes("\n") && !s.includes(",\n"))) {
      return `[${items.join(", ")}]`;
    }
    return `[\n    ${items.join(",\n    ")},\n  ]`;
  }
  if (typeof val === "object") {
    const keys = Object.keys(val).filter((k) => val[k] !== undefined);
    if (keys.length === 0) return "{}";
    const entries = keys.map((k) => {
      const sv = serializeValue(val[k]);
      return `${k}: ${sv}`;
    });
    return `{\n    ${entries.join(",\n    ")},\n  }`;
  }
  return JSON.stringify(val);
}

function serializeBlock(block) {
  return serializeValue(block);
}

function generateTypeScriptFile(units, typeName, importType) {
  const entries = units.map((u) => serializeValue(generateOutputContent(u)));
  const body = entries.join(",\n  ");

  return [
    `// Auto-generated by content compiler. Do not edit directly.`,
    `// Generated at: ${new Date().toISOString()}`,
    `import type { ${importType} } from "@/types/content";`,
    ``,
    `const data: ${importType}[] = [`,
    `  ${body}`,
    `];`,
    ``,
    `export default data;`,
    ``,
  ].join("\n");
}

function generateContentIndex(allUnits) {
  const entries = allUnits.map((u) => {
    const fm = u.frontmatter;
    const tags = fm.tag ? [fm.tag] : undefined;
    return {
      type: u.type,
      slug: u.slug,
      title: fm.title || fm.name || fm.term || u.slug,
      dek: fm.dek || fm.definition || fm.tagline,
      published: fm.published,
      tags,
      hero: fm.hero,
    };
  });

  const serialized = serializeValue(entries);
  return [
    `// Auto-generated by content compiler. Do not edit directly.`,
    `import type { ContentIndexEntry } from "@/types/content";`,
    ``,
    `const data: ContentIndexEntry[] = ${serialized};`,
    ``,
    `export default data;`,
    ``,
  ].join("\n");
}

function generateRelationshipGraph(graph) {
  const serialized = serializeValue(graph);
  return [
    `// Auto-generated by content compiler. Do not edit directly.`,
    `import type { RelationshipGraph } from "@/types/content";`,
    ``,
    `const data: RelationshipGraph = ${serialized};`,
    ``,
    `export default data;`,
    ``,
  ].join("\n");
}

function generateSearchIndex(allUnits) {
  const entries = allUnits.map((u) => {
    const fm = u.frontmatter;
    const tags = fm.tag ? [fm.tag] : undefined;
    const allBodyText = u.blocks
      .map((b) => {
        const texts = [];
        for (const val of Object.values(b)) {
          if (typeof val === "string") texts.push(val);
        }
        return texts.join(" ");
      })
      .join(" ")
      .slice(0, 3000);
    return {
      type: u.type,
      slug: u.slug,
      title: fm.title || fm.name || fm.term || u.slug,
      dek: fm.dek || fm.definition || fm.tagline,
      tags,
      body: allBodyText,
    };
  });

  const serialized = serializeValue(entries);
  return [
    `// Auto-generated by content compiler. Do not edit directly.`,
    `import type { SearchIndexEntry } from "@/types/content";`,
    ``,
    `const data: SearchIndexEntry[] = ${serialized};`,
    ``,
    `export default data;`,
    ``,
  ].join("\n");
}

function writeOutput(filename, content) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const filePath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filePath, content, "utf-8");
}

function pluralizeTypeDir(dir) {
  const map = {
    "weaver-portrait": "weaver-portraits",
    "craft-note": "craft-notes",
    "field-note": "field-notes",
    "house-letter": "house-letters",
    "ritual-guide": "ritual-guides",
  };
  return map[dir] || `${dir}s`;
}

async function main() {
  const startTime = Date.now();
  const manifest = loadManifest();
  const newManifest = {};
  let changedCount = 0;
  let unchangedCount = 0;
  const allErrors = [];
  const allWarnings = [];
  const allUnits = [];
  const typeGroups = {};

  console.log("HOP Content Compiler");
  console.log("━".repeat(50));

  const discovered = discoverContent();
  if (discovered.length === 0) {
    console.log("No content units found.");
  }

  for (const unit of discovered) {
    const unitId = `${unit.type}/${unit.slug}`;
    const currentHash = fileHash(unit.indexPath);
    newManifest[unit.indexPath] = currentHash;

    const isChanged = manifest[unit.indexPath] !== currentHash;

    if (!isChanged && manifest[unit.indexPath]) {
      unchangedCount++;
      const cachedManifestPath = path.join(OUTPUT_DIR, `${unit.typeDir}.ts`);
      if (fs.existsSync(cachedManifestPath)) {
        continue;
      }
    }

    changedCount++;
    let frontmatter, blocks;
    try {
      ({ frontmatter, blocks } = parseContent(unit.indexPath));
    } catch (err) {
      allErrors.push({ unit: unitId, message: `Parse error: ${err.message}` });
      continue;
    }

    if (!frontmatter || typeof frontmatter !== "object") {
      allErrors.push({ unit: unitId, message: "Frontmatter is empty or invalid" });
      continue;
    }

    const schema = readSchema(unit.type);
    if (schema) {
      const { errors: valErrors, warnings: valWarnings } = validateFrontmatter(frontmatter, schema, unit.indexPath);
      for (const e of valErrors) allErrors.push({ unit: unitId, message: `Validation error: ${e}` });
      for (const w of valWarnings) allWarnings.push({ unit: unitId, message: `Validation warning: ${w}` });
    }

    const { errors: imgErrors, warnings: imgWarnings } = validateImages(unit.dir, frontmatter, unitId);
    allErrors.push(...imgErrors);
    allWarnings.push(...imgWarnings);

    const { errors: blkErrors, warnings: blkWarnings } = validateBlockImages(unit.dir, blocks, unitId);
    allErrors.push(...blkErrors);
    allWarnings.push(...blkWarnings);

    const readingTime = calculateReadingTime(frontmatter, blocks);

    allUnits.push({
      ...unit,
      id: unitId,
      frontmatter,
      blocks,
      readingTime,
      relationships: null,
    });
  }

  for (const unit of allUnits) {
    const { result: relationships, errors: refErrors, warnings: refWarnings } = resolveContentReferences(unit, allUnits);
    unit.relationships = relationships;
    allErrors.push(...refErrors);
    allWarnings.push(...refWarnings);
  }

  const slugMap = new Map();
  for (const unit of allUnits) {
    const key = `${unit.type}:${unit.slug}`;
    if (slugMap.has(key)) {
      allErrors.push({
        unit: unit.id,
        message: `Duplicate slug '${unit.slug}' in type '${unit.type}' (also found at ${slugMap.get(key)})`,
      });
    }
    slugMap.set(key, unit.id);
  }

  for (const unit of allUnits) {
    const typeDir = unit.typeDir;
    if (!typeGroups[typeDir]) typeGroups[typeDir] = [];
    typeGroups[typeDir].push(unit);
  }

  for (const ct of CONTENT_TYPES) {
    const units = typeGroups[ct.dir] || [];
    const tsContent = generateTypeScriptFile(units, ct.importType, ct.importType);
    writeOutput(`${ct.dir}.ts`, tsContent);
  }

  const contentIndexContent = generateContentIndex(allUnits);
  writeOutput("content-index.ts", contentIndexContent);

  const graph = buildRelationshipGraph(allUnits);
  const graphContent = generateRelationshipGraph(graph);
  writeOutput("relationship-graph.ts", graphContent);

  const searchContent = generateSearchIndex(allUnits);
  writeOutput("search-index.ts", searchContent);

  let copiedImages = 0;
  let failedImages = 0;
  for (const unit of allUnits) {
    try {
      const copied = copyHeroImage(unit.dir, unit.frontmatter, unit.type, unit.slug);
      if (copied) copiedImages++;
    } catch (err) {
      failedImages++;
      allErrors.push({ unit: unit.id, message: `Failed to copy hero image: ${err.message}` });
    }
  }

  const elapsed = Date.now() - startTime;
  console.log(`\nResults:`);
  console.log(`  Files parsed:     ${discovered.length}`);
  if (changedCount > 0) {
    console.log(`  Compiled:         ${changedCount}`);
  }
  if (unchangedCount > 0) {
    console.log(`  Unchanged (cached): ${unchangedCount}`);
  }
  console.log(`  Errors:           ${allErrors.length}`);
  console.log(`  Warnings:         ${allWarnings.length}`);
  console.log(`  Images copied:    ${copiedImages}`);
  if (failedImages > 0) {
    console.log(`  Image copy failures: ${failedImages}`);
  }
  console.log(`  Duration:         ${elapsed}ms`);

  if (allErrors.length > 0) {
    console.log(`\nErrors:`);
    for (const err of allErrors) {
      console.log(`  ✖ ${err.unit}: ${err.message}`);
    }
  }

  if (allWarnings.length > 0) {
    console.log(`\nWarnings:`);
    for (const w of allWarnings) {
      console.log(`  ⚠ ${w.unit}: ${w.message}`);
    }
  }

  if (allErrors.length > 0) {
    console.log(`\n❌ Build failed with ${allErrors.length} error(s).`);
    process.exit(1);
  }

  saveManifest(newManifest);

  if (allWarnings.length > 0) {
    console.log(`\n⚠ Build succeeded with ${allWarnings.length} warning(s).`);
  } else {
    console.log(`\n✅ Build succeeded.`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
