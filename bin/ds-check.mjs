#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const TEXT_FILE_EXTENSIONS = new Set([".tsx", ".jsx", ".ts", ".js"]);

function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", () => resolve(""));

    if (process.stdin.isTTY) {
      resolve("");
    }
  });
}

function extractFilePathFromHookPayload(payload) {
  const candidates = [
    payload?.tool_input?.file_path,
    payload?.toolInput?.file_path,
    payload?.input?.file_path,
    payload?.file_path,
    payload?.filePath
  ];

  return candidates.find(
    (candidate) => typeof candidate === "string" && candidate.length > 0
  );
}

function collectMatches(content, pattern, format) {
  const matches = [];
  for (const match of content.matchAll(pattern)) {
    matches.push(format(match));
  }
  return matches;
}

// the following are the basic tailwind palettes, if you use this plugin and got your own palette, you'll have to update this constant. 
const TAILWIND_PALETTES =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";

const CLASS_BOUNDARY = "(?:^|[\\s\"'`])";

const TAILWIND_COLOR_UTILITY = new RegExp(
  CLASS_BOUNDARY +
  `(?:(?:hover|focus|focus-visible|active|disabled|dark|group-hover|peer-focus):)*` +
  `(?:bg|text|border|ring|outline|from|to|via|fill|stroke)-` +
  `(?:${TAILWIND_PALETTES})-(?:\\d+|white|black)(?:/\\d+)?\\b|` +
  CLASS_BOUNDARY +
  `(?:(?:hover|focus|focus-visible|active|disabled|dark|group-hover|peer-focus):)*` +
  `(?:bg|text|border|ring|outline)-(?:white|black)(?:/\\d+)?\\b`,
  "g"
);

function hasDesignSystemButtonImport(content) {
  return /import\s+\{[^}]*\bButton\b[^}]*\}\s+from\s+["'][^"']+["']/.test(content);
}

function collectTailwindPaletteColors(content) {
  const matches = new Set();
  for (const match of content.matchAll(TAILWIND_COLOR_UTILITY)) {
    const value = match[0].trim().replace(/^["'`\s]+|["'`\s]+$/g, "");
    if (value) matches.add(value);
  }
  return [...matches];
}

function scanContent(content) {
  const issues = [];

  const checks = [
    {
      label: "Hardcoded hex color",
      pattern: /#[0-9a-fA-F]{3,8}\b/g,
      format: (match) => match[0]
    },
    {
      label: "Tailwind arbitrary color",
      pattern: /(?:bg|text|border|from|to|via)-\[#[^\]]+\]/g,
      format: (match) => match[0]
    },
    {
      label: "Tailwind arbitrary value",
      pattern: /(?:p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|w|h|min-w|max-w|min-h|max-h|text|rounded)-\[[^\]]+\]/g,
      format: (match) => match[0]
    },
    {
      label: "Inline style prop",
      pattern: /style=\{\{/g,
      format: () => "style={{ ... }}"
    }
  ];

  for (const check of checks) {
    const matches = collectMatches(content, check.pattern, check.format);
    for (const value of matches) {
      issues.push({ label: check.label, value });
    }
  }

  if (/<button\b/.test(content) && !hasDesignSystemButtonImport(content)) {
    issues.push({
      label: "Raw HTML button instead of design-system Button",
      value: "<button> with local styling"
    });
  }

  for (const utility of collectTailwindPaletteColors(content)) {
    issues.push({
      label: "Tailwind palette color (use design-system tokens instead)",
      value: utility
    });
  }

  return issues;
}

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "coverage",
  "out"
]);

function walkFiles(dir, acc = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }

  for (const entry of entries) {
    if (entry.name.startsWith(".") && entry.name !== ".") {
      if (SKIP_DIRS.has(entry.name)) continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walkFiles(full, acc);
    } else if (TEXT_FILE_EXTENSIONS.has(path.extname(entry.name))) {
      acc.push(full);
    }
  }

  return acc;
}

function bump(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
}

// Rank values by frequency (desc), then by value for stable output.
function rankByFrequency(map) {
  return [...map.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
}

function pxValue(raw) {
  const match = /(-?\d+(?:\.\d+)?)px/.exec(raw);
  return match ? parseFloat(match[1]) : null;
}

function harvestTokens(content, buckets) {
  // Colors: hex literals + Tailwind arbitrary colors.
  // Only valid hex color lengths: #RGB, #RGBA, #RRGGBB, #RRGGBBAA.
  // Alternation is longest-first; \b on both sides rejects odd runs like #9194713.
  for (const m of content.matchAll(
    /(?<![0-9a-fA-F])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})(?![0-9a-fA-F])/g
  )) {
    bump(buckets.colors, m[0].toLowerCase());
  }
  for (const m of content.matchAll(
    /(?:bg|text|border|from|to|via)-\[(#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3}))\]/g
  )) {
    bump(buckets.colors, m[1].toLowerCase());
  }

  // Spacing: padding/margin/gap arbitrary px values.
  for (const m of content.matchAll(
    /(?:p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap)-\[([^\]]+)\]/g
  )) {
    const px = pxValue(m[1]);
    if (px !== null && px >= 0) bump(buckets.spacing, px);
  }

  // Radius: rounded-[..] + border-radius in inline/CSS.
  for (const m of content.matchAll(/rounded(?:-[a-z]+)?-\[([^\]]+)\]/g)) {
    const px = pxValue(m[1]);
    if (px !== null) bump(buckets.radius, px);
  }
  for (const m of content.matchAll(/border-?[Rr]adius:\s*([^;"'}]+)/g)) {
    const px = pxValue(m[1]);
    if (px !== null) bump(buckets.radius, px);
  }

  // Font sizes: text-[..] + fontSize/font-size declarations.
  for (const m of content.matchAll(/text-\[(\d+(?:\.\d+)?px)\]/g)) {
    const px = pxValue(m[1]);
    if (px !== null) bump(buckets.fontSizes, px);
  }
  for (const m of content.matchAll(/font-?[Ss]ize:\s*(\d+(?:\.\d+)?px)/g)) {
    const px = pxValue(m[1]);
    if (px !== null) bump(buckets.fontSizes, px);
  }

  // Shadows: boxShadow / box-shadow values.
  for (const m of content.matchAll(/box-?[Ss]hadow:\s*([^;"'}]+)/g)) {
    const value = m[1].trim();
    if (value) bump(buckets.shadows, value);
  }
}

function buildTokens(buckets, fileCount) {
  const tokens = {
    meta: {
      version: "scanned",
      name: "Scanned tokens",
      generatedBy: "ds-check.mjs --scan-to-tokens",
      filesScanned: fileCount
    },
    colors: {},
    fontSizes: {},
    spacing: {},
    radius: {},
    shadows: {}
  };

  // Colors: ranked by frequency, most-used first.
  rankByFrequency(buckets.colors).forEach(([value, count], i) => {
    tokens.colors[`color-${i + 1}`] = { value, usage: count };
  });

  // Numeric scales: sort ascending by value, name by step.
  const numericScale = (map, prefix, target) => {
    [...map.entries()]
      .sort((a, b) => a[0] - b[0])
      .forEach(([px, count], i) => {
        target[`${prefix}-${i + 1}`] = { value: `${px}px`, usage: count };
      });
  };

  numericScale(buckets.spacing, "space", tokens.spacing);
  numericScale(buckets.radius, "radius", tokens.radius);
  numericScale(buckets.fontSizes, "font-size", tokens.fontSizes);

  rankByFrequency(buckets.shadows).forEach(([value, count], i) => {
    tokens.shadows[`shadow-${i + 1}`] = { value, usage: count };
  });

  return tokens;
}

function scanToTokens(rootDir, outPath) {
  if (!fs.existsSync(rootDir)) {
    console.error(`Design System Guard: directory not found: ${rootDir}`);
    process.exit(1);
  }

  const files = walkFiles(rootDir);
  const buckets = {
    colors: new Map(),
    spacing: new Map(),
    radius: new Map(),
    fontSizes: new Map(),
    shadows: new Map()
  };

  for (const file of files) {
    try {
      harvestTokens(fs.readFileSync(file, "utf8"), buckets);
    } catch {
      // skip unreadable files
    }
  }

  const tokens = buildTokens(buckets, files.length);
  const json = JSON.stringify(tokens, null, 2);

  if (outPath) {
    fs.writeFileSync(outPath, json + "\n", "utf8");
    console.log(`Design System Guard scanned ${files.length} file(s) under ${rootDir}`);
    console.log(
      `Found ${buckets.colors.size} color(s), ${buckets.spacing.size} spacing, ` +
      `${buckets.radius.size} radius, ${buckets.fontSizes.size} font-size, ` +
      `${buckets.shadows.size} shadow value(s).`
    );
    console.log(`Wrote ${outPath}`);
    console.log("");
    console.log("Next: review and curate. Frequent values are likely real tokens;");
    console.log("rare ones are often the drift this plugin exists to catch.");
  } else {
    console.log(json);
  }
}

function printResult(filePath, issues) {
  if (issues.length === 0) {
    console.log(`Design System Guard: no issues found in ${filePath}`);
    return;
  }

  console.log(`Design System Guard found ${issues.length} issue(s) in ${filePath}`);
  console.log("");

  for (const issue of issues) {
    console.log(`- ${issue.label}: ${issue.value}`);
  }

  console.log("");
  console.log("Suggested next step:");
  console.log(`Run /design-system-guard:audit-component ${filePath}`);
}

async function main() {
  const args = process.argv.slice(2);

  // --scan-to-tokens [dir] [--out file]: harvest a tokens.json from the codebase.
  if (args.includes("--scan-to-tokens")) {
    const outIndex = args.indexOf("--out");
    const outPath = outIndex !== -1 ? args[outIndex + 1] : null;
    const outValueIndex = outIndex !== -1 ? outIndex + 1 : -1;
    const rootDir =
      args.find(
        (a, i) => !a.startsWith("--") && i !== outValueIndex
      ) || ".";
    scanToTokens(rootDir, outPath);
    process.exit(0);
  }

  const argPath = args[0];
  const stdin = argPath ? "" : await readStdin();

  let hookPayload = null;
  if (stdin.trim().startsWith("{")) {
    try {
      hookPayload = JSON.parse(stdin);
    } catch {
      hookPayload = null;
    }
  }

  const filePath = argPath || extractFilePathFromHookPayload(hookPayload || {});

  if (!filePath) {
    // Hooks should not fail loudly when no file is available.
    process.exit(0);
  }

  const ext = path.extname(filePath);
  if (!TEXT_FILE_EXTENSIONS.has(ext)) {
    process.exit(0);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`Design System Guard: file not found: ${filePath}`);
    process.exit(0);
  }

  const content = fs.readFileSync(filePath, "utf8");
  const issues = scanContent(content);
  printResult(filePath, issues);

  // Exit 0 because this hook is advisory. It should warn, not block edits.
  process.exit(0);
}

main().catch((error) => {
  console.error("Design System Guard failed:", error.message);
  process.exit(0);
});
