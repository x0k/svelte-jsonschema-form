#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const skillsDir = path.resolve(__dirname, "..");

console.log(`Validating skills in: ${skillsDir}\n`);

const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
const skillDirs = entries
  .filter((e) => e.isDirectory() && e.name !== "scripts" && !e.name.startsWith("."))
  .map((e) => e.name);

let totalErrors = 0;
let totalWarnings = 0;

const NAME_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function parseFrontmatter(content) {
  if (!content.startsWith("---")) {
    return { frontmatter: null, body: content, error: "Missing frontmatter start '---'" };
  }
  const endIndex = content.indexOf("\n---", 3);
  if (endIndex === -1) {
    return { frontmatter: null, body: content, error: "Missing frontmatter end delimiter '\n---'" };
  }

  const rawYaml = content.slice(3, endIndex).trim();
  const body = content.slice(endIndex + 4).trim();
  const frontmatter = {};

  // Simple key-value parser for spec frontmatter
  const lines = rawYaml.split("\n");
  let currentKey = null;
  let currentValue = "";

  for (const line of lines) {
    const match = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (match) {
      if (currentKey) {
        frontmatter[currentKey] = currentValue.trim();
      }
      currentKey = match[1];
      currentValue = match[2];
    } else if (currentKey) {
      currentValue += " " + line.trim();
    }
  }
  if (currentKey) {
    frontmatter[currentKey] = currentValue.trim();
  }

  return { frontmatter, body, error: null };
}

for (const dirName of skillDirs) {
  const skillPath = path.join(skillsDir, dirName);
  const skillFile = path.join(skillPath, "SKILL.md");

  console.log(`Checking [${dirName}]...`);

  if (!fs.existsSync(skillFile)) {
    console.error(`  ❌ Missing SKILL.md in ${dirName}`);
    totalErrors++;
    continue;
  }

  const rawContent = fs.readFileSync(skillFile, "utf-8");
  const { frontmatter, body, error: fmError } = parseFrontmatter(rawContent);

  if (fmError) {
    console.error(`  ❌ Frontmatter error: ${fmError}`);
    totalErrors++;
    continue;
  }

  // 1. Validate name
  const name = frontmatter.name;
  if (!name) {
    console.error(`  ❌ Missing 'name' field in frontmatter`);
    totalErrors++;
  } else {
    if (name !== dirName) {
      console.error(`  ❌ 'name' (${name}) does not match parent directory name (${dirName})`);
      totalErrors++;
    }
    if (name.length < 1 || name.length > 64) {
      console.error(`  ❌ 'name' length must be 1-64 characters (got ${name.length})`);
      totalErrors++;
    }
    if (!NAME_REGEX.test(name)) {
      console.error(`  ❌ 'name' '${name}' contains invalid characters or consecutive hyphens`);
      totalErrors++;
    }
  }

  // 2. Validate description
  const description = frontmatter.description;
  if (!description) {
    console.error(`  ❌ Missing 'description' field in frontmatter`);
    totalErrors++;
  } else {
    if (description.length < 1 || description.length > 1024) {
      console.error(`  ❌ 'description' must be 1-1024 characters (got ${description.length})`);
      totalErrors++;
    }
  }

  // 3. Validate progressive disclosure (<500 lines)
  const lineCount = rawContent.split("\n").length;
  if (lineCount > 500) {
    console.warn(`  ⚠️ Line count is ${lineCount} (>500 lines recommended by specification)`);
    totalWarnings++;
  }

  // 4. Validate relative file links
  const linkMatches = body.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g);
  for (const match of linkMatches) {
    const linkHref = match[2];
    if (linkHref.startsWith("http://") || linkHref.startsWith("https://") || linkHref.startsWith("#")) {
      continue;
    }
    // Clean query/hash
    const cleanRelPath = linkHref.split("#")[0].split("?")[0];
    if (!cleanRelPath) continue;
    const targetPath = path.resolve(skillPath, cleanRelPath);
    if (!fs.existsSync(targetPath)) {
      console.error(`  ❌ Broken relative reference link: ${linkHref} (resolved to ${targetPath})`);
      totalErrors++;
    }
  }

  console.log(`  ✅ Passed checks (${lineCount} lines)\n`);
}

console.log("------------------------------------------");
if (totalErrors === 0) {
  console.log(`🎉 All ${skillDirs.length} skills valid! (${totalWarnings} warnings)`);
  process.exit(0);
} else {
  console.error(`❌ Validation failed with ${totalErrors} error(s) and ${totalWarnings} warning(s)`);
  process.exit(1);
}
