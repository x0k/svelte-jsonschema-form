// @ts-check
import { fileURLToPath } from "node:url";
import { defineConfig } from "eslint/config";
import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import ts from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import prettier from "eslint-config-prettier";
import globals from "globals";

import svelteConfig from "./svelte.config.js";

const gitignorePath = fileURLToPath(
  new URL("../../.gitignore", import.meta.url)
);

export default defineConfig(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ts.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...svelte.configs.recommended,
  prettier,
  ...svelte.configs.prettier,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: { "no-undef": "off" },
  },
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: [".svelte"],
        parser: ts.parser,
        svelteConfig,
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-deprecated": "warn",
    },
  }
);
