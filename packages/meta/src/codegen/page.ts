import { transforms } from "@sveltejs/sv-utils";

import { formPackage } from "../form.ts";

import type { CodegenThemeOrSubTheme, Language } from "./model.ts";
import { createForm, type FormOptions } from "./form.ts";

export interface PageOptions extends FormOptions {
  language: Language;
  themeOrSubTheme: CodegenThemeOrSubTheme;
}

export const PADDED_THEMES: CodegenThemeOrSubTheme[] = [
  "pico",
  "daisyui5",
  "flowbite3",
  "skeleton4",
  "shadcn4",
  "shadcn-extras",
  "beercss",
];

export function createPage(options: PageOptions) {
  const { language, validatorWithSuffix, lib, themeOrSubTheme } = options;
  return transforms.svelteScript({ language }, ({ ast, js, svelte }) => {
    const form = createForm(options);

    js.imports.addNamed(ast.instance.content, {
      imports: form.formPackageImports,
      from: formPackage.name,
    });

    for (const i of form.additionalImports) {
      if ("as" in i) {
        js.imports.addNamespace(ast.instance.content, i);
      } else {
        js.imports.addNamed(ast.instance.content, i);
      }
    }

    js.imports.addNamespace(ast.instance.content, {
      as: "defaults",
      from: lib("sjsf/defaults"),
    });

    js.common.appendFromString(ast.instance.content, { code: form.init });

    if (validatorWithSuffix !== "noop") {
      form.attributes += " novalidate";
    }

    if (PADDED_THEMES.includes(themeOrSubTheme)) {
      form.attributes += ' style="padding: 2rem;"';
    }

    svelte.addFragment(ast, `<BasicForm {form} ${form.attributes}/>`);
  });
}
