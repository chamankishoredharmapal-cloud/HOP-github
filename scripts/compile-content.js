import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load as yamlLoad } from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "src/content");
const OUTPUT_DIR = path.join(ROOT, "src/data/__generated__");
const SCHEMA_DIR = path.join(CONTENT_DIR, "_schemas");

const CONTENT_TYPES = [
  { dir: "journal",          type: "journal",       importType: "JournalArticle" },
  { dir: "collections",      type: "collection",     importType: "CollectionNarrative" },
  { dir: "products",         type: "product",        importType: "ProductStory" },
  { dir: "craft-notes",      type: "craft-note",     importType: "CraftNote" },
  { dir: "weaver-portraits", type: "weaver-portrait",importType: "WeaverPortrait" },
  { dir: "field-notes",      type: "field-note",     importType: "FieldNote" },
  { dir: "house-letters",    type: "house-letter",   importType: "HouseLetter" },
  { dir: "ritual-guides",    type: "ritual-guide",   importType: "RitualGuide" },
  { dir: "glossary",         type: "glossary",       importType: "GlossaryEntry" },
];

const BLOCK_BODY_TYPES = new Set(["intro", "body", "closure", "step", "system-2"]);
const BLOCK_NO_BODY_TYPES = new Set(["hero", "pull-quote", "image", "video", "related"]);
const BLOCK_EMPTY_TYPES = new Set(["divider"]);
const ALL_BLOCK_TYPES = new Set([...BLOCK_BODY_TYPES, ...BLOCK_NO_BODY_TYPES, ...BLOCK_EMPTY_TYPES]);

const GLOSSARY_ENTRY_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*\.md$/;

const ERROR = "error";
const WARNING = "warning";

const errors = [];
const warnings = [];

function report(severity, unit, message) {
  const entry = { unit, message };
  if (severity === ERROR) errors.push(entry);
  else warnings.push(entry);
}

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf-8");
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function readSchema(typeName) {
  const schemaPath = path.join(SCHEMA_DIR, `${typeName}.yaml`);
  if (!fileExists(schemaPath)) return null;
  return yamlLoad(readFile(schemaPath));
}

function parseContent(filePath) {
  const text = readFile(filePath);
  const lines = text.split("\n");

  if (lines[0].trim() !== "---") {
    return { error: "Content must start with ---", frontmatter: null, blocks: [] };
  }

  let fmEnd = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") { fmEnd = i; break; }
  }
  if (fmEnd === -1) return { error: "Frontmatter not closed", frontmatter: null, blocks: [] };

  let frontmatter;
  try {
    frontmatter = yamlLoad(lines.slice(1, fmEnd).join("\n"));
  } catch (e) {
    return { error: `YAML parse error: ${e.message}`, frontmatter: null, blocks: [] };
  }

  const remaining = lines.slice(fmEnd + 1);
  const blocks = [];
  let i = 0;

  while (i < remaining.length) {
    if (remaining[i].trim() !== "---") { i++; continue; }

    const metaLines = [];
    i++;
    while (i < remaining.length && remaining[i].trim() !== "---") {
      metaLines.push(remaining[i]);
      i++;
    }

    let meta = {};
    if (metaLines.length > 0) {
      try {
        const parsed = yamlLoad(metaLines.join("\n"));
        if (parsed && typeof parsed === "object") meta = parsed;
      } catch { /* ignore unparseable metadata, treat as body */ }
    }

    if (i >= remaining.length) break;
    i++;

    const bodyLines = [];
    while (i < remaining.length && remaining[i].trim() !== "---") {
      bodyLines.push(remaining[i]);
      i++;
    }

    const body = bodyLines.join("\n").trim();
    const blockType = meta.type;

    if (BLOCK_BODY_TYPES.has(blockType)) {
      blocks.push({ ...meta, body });
    } else if (BLOCK_NO_BODY_TYPES.has(blockType) || BLOCK_EMPTY_TYPES.has(blockType)) {
      blocks.push(meta);
    } else if (meta.type === "gallery") {
      blocks.push(meta);
    } else if (meta.type) {
      blocks.push(meta);
    }
  }

  return { error: null, frontmatter, blocks };
}

function validateValue(value, fieldName, propSchema, errorList) {
  if (propSchema.const !== undefined) {
    if (value !== propSchema.const) {
      errorList.push(`'${fieldName}' must be '${propSchema.const}', got '${value}'`);
    }
    return;
  }

  if (propSchema.type === "string") {
    if (typeof value !== "string") {
      errorList.push(`Expected string for '${fieldName}', got ${typeof value}`);
      return;
    }
    if (propSchema.enum && !propSchema.enum.includes(value)) {
      errorList.push(`'${fieldName}' must be one of: ${propSchema.enum.join(", ")}. Got '${value}'`);
    }
    if (propSchema.maxLength != null && value.length > propSchema.maxLength) {
      errorList.push(`'${fieldName}' exceeds ${propSchema.maxLength} characters (${value.length})`);
    }
    if (propSchema.pattern && !new RegExp(propSchema.pattern).test(value)) {
      errorList.push(`'${fieldName}' does not match pattern ${propSchema.pattern}`);
    }
    if (propSchema.format === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      errorList.push(`'${fieldName}' must be a valid date in YYYY-MM-DD format`);
    }
  } else if (propSchema.type === "integer") {
    if (!Number.isInteger(value)) {
      errorList.push(`Expected integer for '${fieldName}', got ${typeof value} (${value})`);
      return;
    }
    if (propSchema.minimum != null && value < propSchema.minimum) {
      errorList.push(`'${fieldName}' must be >= ${propSchema.minimum}`);
    }
  } else if (propSchema.type === "array") {
    if (!Array.isArray(value)) {
      errorList.push(`Expected array for '${fieldName}', got ${typeof value}`);
      return;
    }
    if (propSchema.items) {
      for (let idx = 0; idx < value.length; idx++) {
        validateValue(value[idx], `${fieldName}[${idx}]`, propSchema.items, errorList);
      }
    }
  } else if (propSchema.type === "object") {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      errorList.push(`Expected object for '${fieldName}', got ${typeof value}`);
      return;
    }
    if (propSchema.required) {
      for (const req of propSchema.required) {
        if (value[req] === undefined) {
          errorList.push(`Missing required field '${fieldName}.${req}'`);
        }
      }
    }
    if (propSchema.properties) {
      for (const [key, val] of Object.entries(value)) {
        if (propSchema.properties[key]) {
          validateValue(val, `${fieldName}.${key}`, propSchema.properties[key], errorList);
        }
      }
    }
  }
}

function validateFrontmatter(frontmatter, schema, unitId) {
  const errorList = [];

  if (schema.required) {
    for (const req of schema.required) {
      if (frontmatter[req] === undefined) {
        errorList.push(`Missing required field '${req}'`);
      }
    }
  }

  if (schema.properties && schema.type === "object") {
    for (const [key, val] of Object.entries(frontmatter)) {
      if (schema.properties[key]) {
        validateValue(val, key, schema.properties[key], errorList);
      }
    }
  }

  for (const err of errorList) {
    report(ERROR, unitId, `Validation: ${err}`);
  }
}

function validateBlocks(blocks, contentDir, unitId) {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    if (!block.type) {
      report(ERROR, unitId, `Block ${i} has no type`);
      continue;
    }

    if (!ALL_BLOCK_TYPES.has(block.type) && block.type !== "gallery") {
      report(ERROR, unitId, `Block ${i}: unknown block type '${block.type}'`);
      continue;
    }

    if (block.type === "image" || block.type === "hero") {
      if (block.image) {
        const imgPath = path.resolve(contentDir, block.image);
        if (!fileExists(imgPath)) {
          report(ERROR, unitId, `Block ${i}: missing image '${block.image}'`);
        }
      }
      if (!block.alt) {
        report(WARNING, unitId, `Block ${i} (${block.type}): missing alt text`);
      }
    }

    if (block.type === "gallery" && block.images) {
      for (let j = 0; j < block.images.length; j++) {
        const imgPath = path.resolve(contentDir, block.images[j]);
        if (!fileExists(imgPath)) {
          report(ERROR, unitId, `Block ${i} gallery: missing image '${block.images[j]}'`);
        }
      }
    }

    if (block.type === "video") {
      if (block.poster) {
        const posterPath = path.resolve(contentDir, block.poster);
        if (!fileExists(posterPath)) {
          report(WARNING, unitId, `Block ${i}: missing video poster '${block.poster}'`);
        }
      }
    }
  }
}

function resolveReferences(unit, allUnits) {
  const fm = unit.frontmatter;
  const result = {
    relatedProducts: [],
    relatedArticles: [],
    relatedCraftNotes: [],
    relatedCollections: [],
    glossaryTerms: [],
  };

  if (fm.relatedProducts) {
    for (const uuid of fm.relatedProducts) {
      if (allUnits.some((u) => u.frontmatter.productId === uuid)) {
        result.relatedProducts.push(uuid);
      } else {
        report(WARNING, unit.id, `Related product '${uuid}' not found`);
      }
    }
  }

  if (fm.relatedArticles) {
    for (const slug of fm.relatedArticles) {
      const found = allUnits.find((u) => u.type === "journal" && u.slug === slug);
      if (found) {
        result.relatedArticles.push(slug);
      } else {
        report(ERROR, unit.id, `Related article '${slug}' not found`);
      }
    }
  }

  if (fm.relatedCraftNotes) {
    for (const slug of fm.relatedCraftNotes) {
      const found = allUnits.find((u) => u.type === "craft-note" && u.slug === slug);
      if (found) {
        result.relatedCraftNotes.push(slug);
      } else {
        report(ERROR, unit.id, `Related craft note '${slug}' not found`);
      }
    }
  }

  if (fm.glossaryTerms) {
    for (const slug of fm.glossaryTerms) {
      const found = allUnits.find((u) => u.type === "glossary" && u.slug === slug);
      if (found) {
        result.glossaryTerms.push(slug);
      } else {
        report(WARNING, unit.id, `Glossary term '${slug}' not found`);
      }
    }
  }

  if (fm.collections) {
    for (const slug of fm.collections) {
      const found = allUnits.find((u) => u.type === "collection" && u.slug === slug);
      if (found) {
        result.relatedCollections.push(slug);
      } else {
        report(WARNING, unit.id, `Collection '${slug}' not found`);
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

  if (fm.seeAlso) {
    for (const ref of fm.seeAlso) {
      const found = allUnits.find(
        (u) => u.slug === ref && u.type !== "glossary"
      );
      if (!found) {
        report(WARNING, unit.id, `seeAlso reference '${ref}' not found`);
      }
    }
  }

  return result;
}

function calculateReadingTime(frontmatter, blocks) {
  if (frontmatter.readingTime != null) {
    return frontmatter.readingTime;
  }
  const words = blocks
    .flatMap((b) => Object.values(b).filter((v) => typeof v === "string"))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function discoverUnits() {
  const units = [];

  for (const ct of CONTENT_TYPES) {
    const typeDir = path.join(CONTENT_DIR, ct.dir);
    if (!fileExists(typeDir)) continue;

    if (ct.dir === "glossary") {
      const entries = fs.readdirSync(typeDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const indexPath = path.join(typeDir, entry.name, "index.md");
          if (fileExists(indexPath)) {
            units.push({
              type: ct.type,
              typeDir: ct.dir,
              slug: entry.name,
              dir: path.join(typeDir, entry.name),
              indexPath,
              importType: ct.importType,
            });
          }
        } else if (entry.isFile() && GLOSSARY_ENTRY_PATTERN.test(entry.name)) {
          if (entry.name === "index.md") continue;
          const slug = entry.name.replace(/\.md$/, "");
          units.push({
            type: ct.type,
            typeDir: ct.dir,
            slug,
            dir: typeDir,
            indexPath: path.join(typeDir, entry.name),
            importType: ct.importType,
          });
        }
      }
    } else {
      const entries = fs.readdirSync(typeDir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const indexPath = path.join(typeDir, entry.name, "index.md");
        if (!fileExists(indexPath)) continue;
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
  }

  return units;
}

function escapeValue(val) {
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
    const items = val.map((v) => escapeValue(v));
    return `[${items.join(", ")}]`;
  }
  if (typeof val === "object") {
    const keys = Object.keys(val).filter((k) => val[k] !== undefined);
    if (keys.length === 0) return "{}";
    const entries = keys.map((k) => `"${k}": ${escapeValue(val[k])}`);
    return `{ ${entries.join(", ")} }`;
  }
  return JSON.stringify(val);
}

function generateUnitEntry(unit) {
  const { frontmatter, blocks } = unit;
  const entry = { ...frontmatter, body: blocks };
  const rtTypes = new Set(["journal", "craft-note"]);
  if (rtTypes.has(unit.type) && entry.readingTime == null) {
    entry.readingTime = calculateReadingTime(frontmatter, blocks);
  }
  return entry;
}

function generateTypeFile(units, importType) {
  const entries = units.map((u) => escapeValue(generateUnitEntry(u)));
  return [
    "// Auto-generated by content compiler. Do not edit directly.",
    `import type { ${importType} } from "@/types/content";`,
    "",
    `const data: ${importType}[] = [`,
    ...entries.map((e) => `  ${e},`),
    "];",
    "",
    "export default data;",
    "",
  ].join("\n");
}

function generateContentIndex(units) {
  const entries = units.map((u) => {
    const fm = u.frontmatter;
    return {
      type: u.type,
      slug: u.slug,
      title: fm.title || fm.name || fm.term || u.slug,
      dek: fm.dek || fm.tagline || fm.definition,
      published: fm.published,
      tags: fm.tag ? [fm.tag] : undefined,
      hero: fm.hero,
    };
  });

  return [
    "// Auto-generated by content compiler. Do not edit directly.",
    `import type { ContentIndexEntry } from "@/types/content";`,
    "",
    `const data: ContentIndexEntry[] = ${escapeValue(entries)};`,
    "",
    "export default data;",
    "",
  ].join("\n");
}

function generateRelationshipGraph(units) {
  const graph = {};
  for (const unit of units) {
    graph[`${unit.type}/${unit.slug}`] = { ...unit.relationships };
  }

  return [
    "// Auto-generated by content compiler. Do not edit directly.",
    `import type { RelationshipGraph } from "@/types/content";`,
    "",
    `const data: RelationshipGraph = ${escapeValue(graph)};`,
    "",
    "export default data;",
    "",
  ].join("\n");
}

function generateSearchIndex(units) {
  const entries = units.map((u) => {
    const fm = u.frontmatter;
    const allBodyText = u.blocks
      .map((b) => Object.values(b).filter((v) => typeof v === "string").join(" "))
      .join(" ")
      .slice(0, 3000);
    return {
      type: u.type,
      slug: u.slug,
      title: fm.title || fm.name || fm.term || u.slug,
      dek: fm.dek || fm.tagline || fm.definition,
      tags: fm.tag ? [fm.tag] : undefined,
      body: allBodyText,
    };
  });

  return [
    "// Auto-generated by content compiler. Do not edit directly.",
    `import type { SearchIndexEntry } from "@/types/content";`,
    "",
    `const data: SearchIndexEntry[] = ${escapeValue(entries)};`,
    "",
    "export default data;",
    "",
  ].join("\n");
}

function writeOutput(filename, content) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), content, "utf-8");
}

function copyHeroImage(contentDir, frontmatter, unitType, unitSlug) {
  if (!frontmatter.hero) return false;
  const srcPath = path.resolve(contentDir, frontmatter.hero);
  if (!fileExists(srcPath)) {
    report(WARNING, `${unitType}/${unitSlug}`, `Hero image not found: '${frontmatter.hero}'`);
    return false;
  }
  const destDir = path.join(ROOT, "public", "content", unitType, unitSlug);
  const destPath = path.join(destDir, "hero.jpg");
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(srcPath, destPath);
  return true;
}

function checkDuplicateSlugs(units) {
  const seen = new Map();
  for (const unit of units) {
    const key = `${unit.type}:${unit.slug}`;
    if (seen.has(key)) {
      report(ERROR, unit.id, `Duplicate slug '${unit.slug}' in type '${unit.type}' (also at ${seen.get(key)})`);
    }
    seen.set(key, unit.id);
  }
}

function main() {
  const startTime = Date.now();

  console.log("HOP Content Compiler");
  console.log("━".repeat(50));

  const units = discoverUnits();

  for (const unit of units) {
    const unitId = `${unit.type}/${unit.slug}`;
    unit.id = unitId;

    const parsed = parseContent(unit.indexPath);
    if (parsed.error) {
      report(ERROR, unitId, parsed.error);
      continue;
    }

    unit.frontmatter = parsed.frontmatter;
    unit.blocks = parsed.blocks;

    const schema = readSchema(unit.type);
    if (schema) {
      validateFrontmatter(unit.frontmatter, schema, unitId);
    }

    validateBlocks(unit.blocks, unit.dir, unitId);
  }

  checkDuplicateSlugs(units);

  const validUnits = units.filter((u) => u.frontmatter && u.blocks);

  for (const unit of validUnits) {
    unit.relationships = resolveReferences(unit, validUnits);
  }

  const typeGroups = {};
  for (const ct of CONTENT_TYPES) {
    typeGroups[ct.dir] = validUnits.filter((u) => u.typeDir === ct.dir);
  }

  for (const ct of CONTENT_TYPES) {
    const group = typeGroups[ct.dir] || [];
    const content = generateTypeFile(group, ct.importType);
    writeOutput(`${ct.dir}.ts`, content);
  }

  writeOutput("content-index.ts", generateContentIndex(validUnits));
  writeOutput("relationship-graph.ts", generateRelationshipGraph(validUnits));
  writeOutput("search-index.ts", generateSearchIndex(validUnits));

  let copied = 0;
  for (const unit of validUnits) {
    try {
      if (copyHeroImage(unit.dir, unit.frontmatter, unit.type, unit.slug)) copied++;
    } catch (e) {
      report(WARNING, unit.id, `Failed to copy hero image: ${e.message}`);
    }
  }

  const elapsed = Date.now() - startTime;
  console.log(`\nResults:`);
  console.log(`  Content units:    ${validUnits.length}`);
  console.log(`  Errors:           ${errors.length}`);
  console.log(`  Warnings:         ${warnings.length}`);
  console.log(`  Images copied:    ${copied}`);
  console.log(`  Duration:         ${elapsed}ms`);

  if (errors.length > 0) {
    console.log(`\nErrors:`);
    for (const e of errors) {
      console.log(`  ✖ ${e.unit}: ${e.message}`);
    }
  }

  if (warnings.length > 0) {
    console.log(`\nWarnings:`);
    for (const w of warnings) {
      console.log(`  ⚠ ${w.unit}: ${w.message}`);
    }
  }

  if (errors.length > 0) {
    console.log(`\n❌ Build failed with ${errors.length} error(s).`);
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.log(`\n⚠ Build succeeded with ${warnings.length} warning(s).`);
  } else {
    console.log(`\n✅ Build succeeded.`);
  }
}

main();
