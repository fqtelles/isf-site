const { readdirSync, statSync } = require("fs");
const { join, extname, relative } = require("path");
const parser = require("next/dist/compiled/babel/parser");

const ROOT = process.cwd();
const TARGETS = ["app", "lib", "prisma", "scripts"];
const ROOT_FILES = ["next.config.mjs", "proxy.js", "ecosystem.config.js"];
const EXTENSIONS = new Set([".js", ".mjs"]);
const IGNORE_PARTS = new Set(["node_modules", ".next", ".git"]);

function walk(dir, results) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_PARTS.has(entry.name)) continue;

    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, results);
      continue;
    }

    if (EXTENSIONS.has(extname(entry.name))) {
      results.push(fullPath);
    }
  }
}

function collectFiles() {
  const files = [];

  for (const target of TARGETS) {
    const fullPath = join(ROOT, target);
    try {
      if (statSync(fullPath).isDirectory()) {
        walk(fullPath, files);
      }
    } catch {
      // Skip directories that do not exist in this workspace.
    }
  }

  for (const file of ROOT_FILES) {
    const fullPath = join(ROOT, file);
    try {
      if (statSync(fullPath).isFile()) {
        files.push(fullPath);
      }
    } catch {
      // Skip files that do not exist in this workspace.
    }
  }

  return files.sort((a, b) => a.localeCompare(b));
}

function main() {
  const files = collectFiles();
  if (files.length === 0) {
    console.log("No JavaScript files found to lint.");
    return;
  }

  const failures = [];

  for (const file of files) {
    try {
      const source = require("fs").readFileSync(file, "utf8");
      parser.parse(source, {
        sourceType: "module",
        plugins: [
          "jsx",
          "importAttributes",
          "dynamicImport",
          "optionalChaining",
          "nullishCoalescingOperator",
          "classProperties",
          "classPrivateProperties",
          "classPrivateMethods",
          "topLevelAwait",
        ],
      });
    } catch (error) {
      failures.push({
        file: relative(ROOT, file),
        output: error.message.trim(),
      });
    }
  }

  if (failures.length > 0) {
    console.error(`Syntax lint failed in ${failures.length} file(s):\n`);
    for (const failure of failures) {
      console.error(`${failure.file}\n${failure.output}\n`);
    }
    process.exit(1);
  }

  console.log(`Syntax lint passed for ${files.length} file(s).`);
}

main();
