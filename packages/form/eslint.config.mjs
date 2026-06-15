// @ts-check
import { svelteConfig } from "../../eslint.config.js";
import sveltePluginConfig from "./svelte.config.js";
import ts from "typescript-eslint";

export default [
  ...svelteConfig,
  {
    files: [
      "src/**/*.ts",
      "src/**/*.js",
      "src/**/*.mjs",
      "src/**/*.svelte",
      "src/**/*.svelte.ts",
    ],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.ts", "*.js", "*.mjs"],
        },
        extraFileExtensions: [".svelte"],
        parser: ts.parser,
        svelteConfig: sveltePluginConfig,
      },
    },
    rules: {
      "require-yield": "off",
      "@typescript-eslint/no-deprecated": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/only-throw-error": "off",
    },
  },
];
