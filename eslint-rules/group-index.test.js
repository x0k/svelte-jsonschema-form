import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";

import { Linter } from "eslint";
import tseslint from "typescript-eslint";

import plugin from "./group-index.js";

const FILES = {
  "package.json": JSON.stringify({
    name: "group-index-fixture",
    private: true,
    type: "module",
    imports: {
      "#lib/*": "./src/lib/*",
      "#lib": "./src/lib/index.js",
    },
  }),
  "src/lib/index.ts": 'export * from "./group/index.js";\n',
  "src/lib/group/index.ts": [
    'export * from "./star.js";',
    'export { named, renamed as alias } from "./named.js";',
    'export type { TypeOnly } from "./types.js";',
    'export * as namespace from "./namespace.js";',
    'export { default as DefaultNamed } from "./default-named.js";',
    'export { default } from "./default-plain.js";',
    'export type * from "./type-star.js";',
    "",
  ].join("\n"),
  "src/lib/group/star.ts": "export const star = 1;\nexport default star;\n",
  "src/lib/group/named.ts":
    "export const named = 1;\nexport const renamed = 2;\nexport const hidden = 3;\n",
  "src/lib/group/types.ts":
    "export type TypeOnly = string;\nexport const typeValue = 1;\n",
  "src/lib/group/namespace.ts": "export const viaNamespace = 1;\n",
  "src/lib/group/default-named.ts":
    "const value = 1;\nexport default value;\nexport const other = 2;\n",
  "src/lib/group/default-plain.ts": "const value = 1;\nexport default value;\n",
  "src/lib/group/type-star.ts":
    "export type StarType = number;\nexport const starValue = 1;\n",
  "src/lib/group/inner.ts": "export const inner = 1;\n",
  "src/lib/plain/thing.ts": "export const thing = 1;\n",
  "src/consumer/main.ts": "export {};\n",
};

let root;
let linter;

const CONFIG = {
  files: ["**/*.{ts,svelte}"],
  languageOptions: {
    ecmaVersion: 2024,
    sourceType: "module",
    parser: tseslint.parser,
  },
  plugins: { "group-index": plugin },
  rules: { "group-index/prefer": "error" },
};

/**
 * @param {string} code
 * @param {string} [file]
 * @returns {import("eslint").Linter.LintMessage[]}
 */
function lint(code, file = "src/consumer/main.ts") {
  return linter.verify(code, CONFIG, { filename: path.join(root, file) });
}

/** @param {string} code @param {string} [file] */
function violations(code, file) {
  return lint(code, file).map((message) => message.message);
}

/** @param {string} code @param {string} [file] */
function suggestion(code, file) {
  const [message] = lint(code, file);
  assert.ok(message?.suggestions?.[0], "expected a suggestion");
  return JSON.parse(message.suggestions[0].fix.text);
}

before(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "group-index-"));
  for (const [file, contents] of Object.entries(FILES)) {
    const target = path.join(root, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, contents);
  }
  linter = new Linter({ cwd: root });
});

after(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

describe("group-index/prefer", () => {
  describe("re-exports", () => {
    it("flags modules exposed by `export *`", () => {
      assert.deepEqual(
        violations('import { star } from "#lib/group/star.js";'),
        [
          'Import "group" through its index module instead: "#lib/group/index.js".',
        ]
      );
    });

    it("flags modules exposed by named re-exports", () => {
      assert.equal(
        violations('import { named } from "#lib/group/named.js";').length,
        1
      );
    });

    it("flags modules exposed under another name", () => {
      assert.equal(
        violations('import { alias } from "#lib/group/named.js";').length,
        1
      );
    });

    it("ignores modules the index does not re-export", () => {
      assert.deepEqual(
        violations('import { hidden } from "#lib/group/named.js";'),
        []
      );
    });

    it("requires every imported name to be re-exported", () => {
      assert.deepEqual(
        violations('import { named, hidden } from "#lib/group/named.js";'),
        []
      );
      assert.equal(
        violations('import { named, alias } from "#lib/group/named.js";')
          .length,
        1
      );
    });

    it("flags type-only re-exports for type imports", () => {
      assert.equal(
        violations('import type { TypeOnly } from "#lib/group/types.js";')
          .length,
        1
      );
    });

    it("does not let type-only re-exports satisfy value imports", () => {
      assert.deepEqual(
        violations('import { TypeOnly } from "#lib/group/types.js";'),
        []
      );
    });

    it("flags `export type *` for type imports only", () => {
      assert.equal(
        violations('import type { StarType } from "#lib/group/type-star.js";')
          .length,
        1
      );
      assert.deepEqual(
        violations('import { starValue } from "#lib/group/type-star.js";'),
        []
      );
    });

    it("ignores namespace re-exports", () => {
      assert.deepEqual(
        violations('import { viaNamespace } from "#lib/group/namespace.js";'),
        []
      );
    });

    it("does not treat `export *` as a default re-export", () => {
      assert.deepEqual(
        violations('import star from "#lib/group/star.js";'),
        []
      );
    });

    it("flags an explicitly re-exported default", () => {
      assert.equal(
        violations('import value from "#lib/group/default-plain.js";').length,
        1
      );
    });

    it("ignores a default re-exported under another name", () => {
      assert.deepEqual(
        violations('import value from "#lib/group/default-named.js";'),
        []
      );
      assert.equal(
        violations(
          'import { DefaultNamed } from "#lib/group/default-named.js";'
        ).length,
        1
      );
    });

    it("ignores exports missing from the named re-export", () => {
      assert.deepEqual(
        violations('import { other } from "#lib/group/default-named.js";'),
        []
      );
    });

    it("ignores modules no group index exposes", () => {
      assert.deepEqual(
        violations('import { thing } from "#lib/plain/thing.js";'),
        []
      );
    });
  });

  describe("imports that are already correct", () => {
    it("allows the index itself", () => {
      assert.deepEqual(
        violations('import { star } from "#lib/group/index.js";'),
        []
      );
    });

    it("allows directory imports", () => {
      assert.deepEqual(violations('import { star } from "#lib/group";'), []);
    });

    it("allows side-effect imports", () => {
      assert.deepEqual(violations('import "#lib/group/star.js";'), []);
    });

    it("allows namespace imports", () => {
      assert.deepEqual(
        violations('import * as star from "#lib/group/star.js";'),
        []
      );
    });

    it("allows imports from inside the group", () => {
      assert.deepEqual(
        violations(
          'import { star } from "./star.js";',
          "src/lib/group/inner.ts"
        ),
        []
      );
    });

    it("exempts test files", () => {
      assert.deepEqual(
        violations(
          'import { star } from "#lib/group/star.js";',
          "src/consumer/main.test.ts"
        ),
        []
      );
      assert.deepEqual(
        violations(
          'import { star } from "#lib/group/star.js";',
          "src/consumer/main.spec.ts"
        ),
        []
      );
    });
  });

  describe("suggestions", () => {
    it("suggests a relative index for relative imports", () => {
      assert.deepEqual(
        violations('import { star } from "../lib/group/star.js";'),
        [
          'Import "group" through its index module instead: "../lib/group/index.js".',
        ]
      );
      assert.equal(
        suggestion('import { star } from "../lib/group/star.js";'),
        "../lib/group/index.js"
      );
    });

    it("preserves the extension style of the specifier", () => {
      assert.equal(
        suggestion('import { star } from "#lib/group/star.js";'),
        "#lib/group/index.js"
      );
      assert.equal(
        suggestion('import { star } from "#lib/group/star.ts";'),
        "#lib/group/index.ts"
      );
      assert.equal(
        suggestion('import { star } from "#lib/group/star";'),
        "#lib/group/index"
      );
    });

    it("replaces the whole specifier in the fix", () => {
      const [message] = lint('import { named } from "#lib/group/named.js";');
      assert.ok(message.suggestions?.[0]);
      assert.equal(
        message.suggestions[0].fix.range[0],
        "import { named } from ".length
      );
    });
  });
});
