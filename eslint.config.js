// @ts-check
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import svelte from "eslint-plugin-svelte";
import { defineConfig, includeIgnoreFile } from "eslint/config";
import globals from "globals";
import ts from "typescript-eslint";

import groupIndexPlugin from "./eslint-rules/group-index.js";

const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

/**
 * Require imports of a directory that has an `index` module to go through that
 * index instead of a file inside it. Files inside the group may still import
 * their siblings directly.
 * @type {import("eslint").Linter.Config}
 */
const groupedImportsConfig = {
  plugins: { "group-index": groupIndexPlugin },
  rules: {
    "group-index/prefer": "error",
  },
};

/** Shared ESLint config for Svelte packages in this monorepo. */
export const svelteConfig = defineConfig(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ts.configs.recommended,
  svelte.configs.recommended,
  prettier,
  svelte.configs.prettier,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "no-undef": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "svelte/prefer-svelte-reactivity": "off",
      "svelte/no-unused-props": "off",
    },
  },
  groupedImportsConfig,
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: [".svelte"],
        parser: ts.parser,
      },
    },
  }
);

/** Shared ESLint config for pure TypeScript packages in this monorepo. */
export const tsConfig = defineConfig(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ts.configs.recommended,
  prettier,
  {
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      "no-undef": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  groupedImportsConfig
);

export default defineConfig({ ignores: [] });
