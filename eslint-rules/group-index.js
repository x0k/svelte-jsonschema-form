import fs from "node:fs";
import path from "node:path";

const SOURCE_EXTENSIONS = [
  ".svelte.ts",
  ".svelte.js",
  ".svelte",
  ".tsx",
  ".ts",
  ".mts",
  ".cts",
  ".jsx",
  ".js",
  ".mjs",
  ".cjs",
];

const INDEX_NAMES = SOURCE_EXTENSIONS.map((ext) => `index${ext}`).concat(
  "index.d.ts"
);

const INDEX_PATTERN =
  /^index(?:\.d)?(?:\.[cm]?[jt]sx?|\.svelte(?:\.(?:ts|js))?)?$/;

const EXTENSION_PATTERN = /(\.svelte(?:\.(?:ts|js))?|\.[cm]?[jt]sx?)$/;

const RE_EXPORT =
  /\bexport\s+(?:(type)\s+)?(?:\*\s*(?:(as)\s+[\w$]+\s+)?from\s*["']([^"']+)["']|\{([^}]*)\}\s*from\s*["']([^"']+)["'])/g;

/** @typedef {{ target: string, base: string, prefix: string }} AliasResolution */

/**
 * What an `index` module re-exports from a single module.
 * @typedef {object} ReExports
 * @property {boolean} wildcard Every value and type is re-exported.
 * @property {boolean} typeWildcard Every type is re-exported.
 * @property {Set<string>} values Re-exported value names.
 * @property {Set<string>} types Re-exported type names.
 */

/** @type {Map<string, import("node:fs").Stats | undefined>} */
const statCache = new Map();
/** @type {Map<string, string | undefined>} */
const indexCache = new Map();
/** @type {Map<string, Map<string, ReExports>>} */
const exportsCache = new Map();
/** @type {Map<string, { imports?: Record<string, unknown> }>} */
const packageJsonCache = new Map();

/**
 * @param {string} filePath
 * @returns {import("node:fs").Stats | undefined}
 */
function stat(filePath) {
  if (!statCache.has(filePath)) {
    let value;
    try {
      value = fs.statSync(filePath);
    } catch {
      value = undefined;
    }
    statCache.set(filePath, value);
  }
  return statCache.get(filePath);
}

/** @param {string} filePath @returns {boolean} */
function isFile(filePath) {
  return stat(filePath)?.isFile() === true;
}

/** @param {string} filePath @returns {boolean} */
function isDirectory(filePath) {
  return stat(filePath)?.isDirectory() === true;
}

/** @param {string} filePath @returns {boolean} */
function isIndexFile(filePath) {
  return INDEX_PATTERN.test(path.basename(filePath));
}

/**
 * Returns the `index` module of `dir`, or `undefined` when it has none.
 * @param {string} dir
 * @returns {string | undefined}
 */
function findIndex(dir) {
  if (!indexCache.has(dir)) {
    let index;
    for (const name of INDEX_NAMES) {
      const candidate = path.join(dir, name);
      if (isFile(candidate)) {
        index = candidate;
        break;
      }
    }
    indexCache.set(dir, index);
  }
  return indexCache.get(dir);
}

/**
 * Resolves a written specifier to the source file it refers to.
 * @param {string} filePath
 * @returns {string | undefined}
 */
function resolveFile(filePath) {
  if (isFile(filePath)) {
    return filePath;
  }
  const written = EXTENSION_PATTERN.exec(path.basename(filePath))?.[1];
  const base =
    written === undefined ? filePath : filePath.slice(0, -written.length);
  for (const ext of SOURCE_EXTENSIONS) {
    const candidate = `${base}${ext}`;
    if (isFile(candidate)) {
      return candidate;
    }
  }
  return undefined;
}

/** @param {string} from @returns {string | undefined} */
function findPackageRoot(from) {
  let dir = from;
  for (;;) {
    if (isFile(path.join(dir, "package.json"))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      return undefined;
    }
    dir = parent;
  }
}

/**
 * @param {string} packageRoot
 * @returns {{ imports?: Record<string, unknown> }}
 */
function readPackageJson(packageRoot) {
  if (!packageJsonCache.has(packageRoot)) {
    let json;
    try {
      json = JSON.parse(
        fs.readFileSync(path.join(packageRoot, "package.json"), "utf8")
      );
    } catch {
      json = {};
    }
    packageJsonCache.set(packageRoot, json);
  }
  return /** @type {{ imports?: Record<string, unknown> }} */ (
    packageJsonCache.get(packageRoot)
  );
}

/**
 * Resolves an internal `#` specifier through the nearest `package.json`
 * `imports` map. Returns the resolved path and enough context to build a
 * suggested alias.
 * @param {string} specifier
 * @param {string} importerDir
 * @returns {AliasResolution | undefined}
 */
function resolveAlias(specifier, importerDir) {
  if (!specifier.startsWith("#")) {
    return undefined;
  }
  const packageRoot = findPackageRoot(importerDir);
  if (packageRoot === undefined) {
    return undefined;
  }
  const imports = readPackageJson(packageRoot).imports;
  if (imports === undefined || imports === null) {
    return undefined;
  }
  /** @type {{ key: string, target: string, base: string, prefix: string } | undefined} */
  let best;
  for (const [key, value] of Object.entries(imports)) {
    if (typeof value !== "string") {
      continue;
    }
    let match;
    if (key.endsWith("/*")) {
      const prefix = key.slice(0, -1);
      if (!specifier.startsWith(prefix)) {
        continue;
      }
      const base = path.resolve(packageRoot, value.slice(0, -1));
      match = {
        key,
        target: path.resolve(base, specifier.slice(prefix.length)),
        base,
        prefix,
      };
    } else if (key === specifier) {
      const target = path.resolve(packageRoot, value);
      match = {
        key,
        target,
        base: path.dirname(target),
        prefix: key,
      };
    } else {
      continue;
    }
    if (best === undefined || match.prefix.length > best.prefix.length) {
      best = match;
    }
  }
  if (best === undefined) {
    return undefined;
  }
  return {
    target: best.target,
    base: best.base,
    prefix: best.prefix,
  };
}

/** @param {string} specifier @returns {string} */
function stripSuffix(specifier) {
  // A leading `#` starts an internal alias, not a URL fragment.
  const start = specifier.startsWith("#") ? 1 : 0;
  const query = specifier.slice(start).search(/[?#]/);
  return query === -1 ? specifier : specifier.slice(0, start + query);
}

/**
 * Resolves an absolute specifier to its file and nearest group directory.
 * @param {string} filePath
 * @returns {{ targetFile: string | undefined, targetDir: string }}
 */
function resolveTarget(filePath) {
  const file = resolveFile(filePath);
  if (file !== undefined) {
    return {
      targetFile: file,
      targetDir: path.dirname(file),
    };
  }
  // An extensionless path that does not name a file is a directory import,
  // which resolves to the directory's index.
  if (
    isDirectory(filePath) ||
    !EXTENSION_PATTERN.test(path.basename(filePath))
  ) {
    return {
      targetFile: findIndex(filePath),
      targetDir: filePath,
    };
  }
  return {
    targetFile: undefined,
    targetDir: path.dirname(filePath),
  };
}

/**
 * Finds the closest ancestor of `dir` that contains an `index` module.
 * @param {string} dir
 * @param {string} root
 * @returns {string | undefined}
 */
function findGroup(dir, root) {
  let current = dir;
  for (;;) {
    if (findIndex(current) !== undefined) {
      return current;
    }
    if (current === root) {
      return undefined;
    }
    const parent = path.dirname(current);
    if (parent === current || !isInside(current, root)) {
      return undefined;
    }
    current = parent;
  }
}

/** @param {string} child @param {string} parent @returns {boolean} */
function isInside(child, parent) {
  return child === parent || child.startsWith(`${parent}${path.sep}`);
}

/**
 * Tests may reach into a module's internals, because loading its index can pull
 * in browser-only or side-effect-heavy modules they do not need.
 * @param {string} filePath
 * @returns {boolean}
 */
function isTestFile(filePath) {
  return /\.(?:test|spec)\./.test(path.basename(filePath));
}

/** @param {string} filePath @returns {string} */
function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

/** @returns {ReExports} */
function createReExports() {
  return {
    wildcard: false,
    typeWildcard: false,
    values: new Set(),
    types: new Set(),
  };
}

/**
 * Records the names of a named `export { ... } from` statement.
 * @param {string} list
 * @param {boolean} typeOnly
 * @param {ReExports} reexports
 */
function addNamedReExports(list, typeOnly, reexports) {
  for (const part of list.split(",")) {
    const text = part.trim();
    if (text === "") {
      continue;
    }
    let rest = text;
    let isType = typeOnly;
    if (/^type\s+/.test(rest)) {
      isType = true;
      rest = rest.slice("type".length).trim();
    }
    const as = /\s+as\s+/.exec(rest);
    const exported = (as === null ? rest : rest.slice(as.index + as[0].length))
      .trim()
      .replace(/^["']|["']$/g, "");
    if (exported === "") {
      continue;
    }
    if (isType) {
      reexports.types.add(exported);
    } else {
      // A plain re-export can name a type as well as a value.
      reexports.values.add(exported);
      reexports.types.add(exported);
    }
  }
}

/**
 * @param {string} specifier
 * @param {string} fromDir
 * @returns {string | undefined}
 */
function resolveExportTarget(specifier, fromDir) {
  if (specifier.startsWith(".")) {
    return path.resolve(fromDir, specifier);
  }
  if (specifier.startsWith("#")) {
    return resolveAlias(specifier, fromDir)?.target;
  }
  return undefined;
}

/**
 * Modules re-exported by the index module of `groupDir`, keyed by module file.
 * @param {string} groupDir
 * @returns {Map<string, ReExports> | undefined}
 */
function indexExports(groupDir) {
  const index = findIndex(groupDir);
  if (index === undefined) {
    return undefined;
  }
  if (!exportsCache.has(index)) {
    const exported = new Map();
    const fromDir = path.dirname(index);
    const source = fs.readFileSync(index, "utf8");
    for (const match of source.matchAll(RE_EXPORT)) {
      const [, typeKeyword, asKeyword, wildcard, named, namedSpecifier] = match;
      // `export * as ns from` exposes a namespace, not the module's names.
      if (asKeyword !== undefined) {
        continue;
      }
      const target = resolveExportTarget(
        stripSuffix(wildcard ?? namedSpecifier),
        fromDir
      );
      if (target === undefined) {
        continue;
      }
      const file = resolveTarget(target).targetFile;
      if (file === undefined) {
        continue;
      }
      let entry = exported.get(file);
      if (entry === undefined) {
        entry = createReExports();
        exported.set(file, entry);
      }
      if (wildcard !== undefined) {
        if (typeKeyword !== undefined) {
          entry.typeWildcard = true;
        } else {
          entry.wildcard = true;
        }
      } else {
        addNamedReExports(named, typeKeyword !== undefined, entry);
      }
    }
    exportsCache.set(index, exported);
  }
  return exportsCache.get(index);
}

/**
 * The names an import declaration binds, with their type-ness, or `null` when
 * the declaration cannot be satisfied by a named re-export (namespace imports,
 * which would bind the index itself).
 * @param {any} node
 * @returns {{ name: string, type: boolean }[] | null}
 */
function importedNames(node) {
  const declarationType = node.importKind === "type";
  const names = [];
  for (const specifier of node.specifiers) {
    if (specifier.type === "ImportNamespaceSpecifier") {
      return null;
    }
    if (specifier.type === "ImportDefaultSpecifier") {
      names.push({ name: "default", type: declarationType });
      continue;
    }
    const imported = specifier.imported;
    names.push({
      name: imported.type === "Identifier" ? imported.name : imported.value,
      type: declarationType || specifier.importKind === "type",
    });
  }
  return names;
}

/**
 * Whether the index module covers every imported name.
 * @param {ReExports} reexports
 * @param {{ name: string, type: boolean }[]} names
 * @returns {boolean}
 */
function isReExported(reexports, names) {
  return names.every(({ name, type }) => {
    if (name === "default") {
      // `export *` does not re-export the default binding.
      return reexports.values.has(name) || (type && reexports.types.has(name));
    }
    if (reexports.wildcard || reexports.values.has(name)) {
      return true;
    }
    return type && (reexports.typeWildcard || reexports.types.has(name));
  });
}

/**
 * The extension to append to the suggested index import. The importer may use
 * `.js` for TypeScript modules (`NodeNext` style) or `.ts` directly, so keep
 * its convention when the index module allows it.
 * @param {string} specifier
 * @param {string} indexFile
 * @returns {string}
 */
function suggestionExtension(specifier, indexFile) {
  const written = EXTENSION_PATTERN.exec(specifier)?.[1];
  if (written === undefined) {
    return "";
  }
  const indexExtension =
    EXTENSION_PATTERN.exec(path.basename(indexFile))?.[1] ?? "";
  if (indexExtension.startsWith(".svelte")) {
    return indexExtension;
  }
  if (written.startsWith(".svelte")) {
    const suffix = written.slice(".svelte".length);
    return suffix === "" ? written : suffix;
  }
  if (/\.(?:ts|tsx|mts|cts)$/.test(indexExtension)) {
    return /\.(?:ts|tsx|mts|cts)$/.test(written) ? written : ".js";
  }
  return indexExtension === "" ? written : indexExtension;
}

/**
 * @param {string} importerDir
 * @param {string} groupDir
 * @param {string} extension
 * @returns {string}
 */
function relativeSpecifier(importerDir, groupDir, extension) {
  const relative = toPosix(path.relative(importerDir, groupDir));
  const prefix =
    relative === ""
      ? "."
      : relative.startsWith(".")
        ? relative
        : `./${relative}`;
  return `${prefix}/index${extension}`;
}

/**
 * @param {AliasResolution} alias
 * @param {string} groupDir
 * @param {string} extension
 * @returns {string}
 */
function aliasSpecifier(alias, groupDir, extension) {
  const relative = toPosix(path.relative(alias.base, groupDir));
  const prefix = alias.prefix.endsWith("/") ? alias.prefix : `${alias.prefix}/`;
  return `${prefix}${relative === "" ? "" : `${relative}/`}index${extension}`;
}

/** @type {import("eslint").Rule.RuleModule} */
const preferIndex = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Import a module that its directory exposes through an index module via that index",
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      preferIndex:
        'Import "{{group}}" through its index module instead: "{{suggestion}}".',
    },
  },
  create(context) {
    const importer = context.filename;
    if (
      importer === undefined ||
      importer === "<input>" ||
      importer === "<text>" ||
      isTestFile(importer)
    ) {
      return {};
    }
    const importerDir = path.dirname(path.resolve(importer));
    const packageRoot = findPackageRoot(importerDir);
    if (packageRoot === undefined) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        const specifier = node.source.value;
        if (typeof specifier !== "string") {
          return;
        }
        /** @type {string} */
        let target;
        /** @type {AliasResolution | undefined} */
        let alias;
        if (specifier.startsWith(".")) {
          target = path.resolve(importerDir, stripSuffix(specifier));
        } else if (specifier.startsWith("#")) {
          alias = resolveAlias(specifier, importerDir);
          if (alias === undefined) {
            return;
          }
          target = alias.target;
        } else {
          return;
        }

        const { targetFile, targetDir } = resolveTarget(target);
        if (targetFile === undefined || isInside(importerDir, targetDir)) {
          return;
        }
        if (isIndexFile(targetFile)) {
          return;
        }
        // A Svelte component is not interchangeable with the module graph its
        // index pulls in, and the index may be a plain TypeScript module.
        if (targetFile.endsWith(".svelte")) {
          return;
        }
        const groupDir = findGroup(targetDir, packageRoot);
        if (groupDir === undefined || isInside(importerDir, groupDir)) {
          return;
        }
        const names = importedNames(node);
        if (names === null || names.length === 0) {
          return;
        }
        const reexports = indexExports(groupDir)?.get(targetFile);
        if (reexports === undefined || !isReExported(reexports, names)) {
          return;
        }

        const extension = suggestionExtension(
          stripSuffix(specifier),
          findIndex(groupDir) ?? ""
        );
        const suggestion =
          alias === undefined
            ? relativeSpecifier(importerDir, groupDir, extension)
            : aliasSpecifier(alias, groupDir, extension);

        context.report({
          node: node.source,
          messageId: "preferIndex",
          data: {
            group: path.basename(groupDir),
            suggestion,
          },
          suggest: [
            {
              messageId: "preferIndex",
              data: {
                group: path.basename(groupDir),
                suggestion,
              },
              fix(fixer) {
                return fixer.replaceText(
                  node.source,
                  JSON.stringify(suggestion)
                );
              },
            },
          ],
        });
      },
    };
  },
};

/** ESLint plugin that enforces importing grouped modules through their index. */
const groupIndexPlugin = {
  meta: { name: "group-index" },
  rules: { prefer: preferIndex },
};

export default groupIndexPlugin;
