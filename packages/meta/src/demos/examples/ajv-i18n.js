import sveltePage from "examples/basic-starter/src/routes/ajv-i18n/+page.svelte?raw";

import { extraPackage } from "../../package.js";
import { defineExample, defineMeta, ExampleCategory, Tag } from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.LogicExtension,
  title: "AJV i18n",
  description: "AJV validation with localized error messages using ajv-i18n.",
  tags: [Tag.Schema],
  isValidatorSpecific: true,
});

export default defineExample({
  validator: "ajv8",
  dependencies: [extraPackage("ajvFormat"), extraPackage("ajvI18n")],
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
