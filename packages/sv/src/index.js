import { defineAddon, defineAddonOptions } from "sv";
import { transforms } from "./sv-utils.js";

const options = defineAddonOptions()
  .add("theme", {
    question: "Theme?",
    type: "select",
    default: "basic",
    options: [
      { value: "basic", label: "Basic" },
      { value: "picocss", label: "Pico CSS" },
      { value: "daisyui5", label: "daisyUI v5" },
      { value: "flowbite", label: "Flowbite" },
      { value: "skeleton4", label: "Skeleton v4" },
      { value: "shadcn", label: "shadcn-svelte" },
      { value: "svar", label: "SVAR", hint: "experimental" },
      { value: "beercss", label: "Beer CSS v4", hint: "experimental" },
    ],
  })
  .add("shadcnExtras", {
    question: "Add `shadcn-svelte-extras` components (experimental)?",
    type: "boolean",
    default: false,
    condition: (o) => o.theme === "shadcn",
  })
  .add("validator", {
    question: "Validator?",
    type: "select",
    default: "ajv8",
    options: [
      { value: "ajv8", label: "AJV v8" },
      { value: "zod4", label: "Zod v4" },
      { value: "valibot", label: "Valibot" },
      { value: "cfworker", label: "@cfworker/json-schema" },
      { value: "schemasafe", label: "@exodus/schemasafe" },
      {
        value: "standardSchema",
        label: "Standard Schema",
        hint: "limited support",
      },
    ],
  })
  .add("typeInference", {
    question:
      "Add library to infer TS types from JSON schemas (json-schema-to-ts)?",
    type: "boolean",
    default: true,
    // JSON Schema validators
    condition: (o) => ["ajv8", "cfworker", "schemasafe"].includes(o.validator),
  })
  .add("sveltekit", {
    question: "Setup SvelteKit integration?",
    type: "select",
    default: "no",
    options: [
      { value: "no", label: "No" },
      { value: "formActions", label: "Form Actions" },
      {
        value: "remoteFunctions",
        label: "Remote Functions",
        hint: "experimental",
      },
    ],
  })
  .build();

export default defineAddon({
  id: "@sjsf/sv",
  options,

  // setup: ({ isKit, unsupported }) => {
  // 	if (!isKit) unsupported('Requires SvelteKit');
  // },

  run: ({ directory, sv, options, language }) => {
    sv.file(
      `${directory.lib}/@sjsf/sv/content.txt`,
      transforms.text(() => {
        return `This is a text file made by the Community Addon Template demo for the add-on: '@sjsf/sv'!`;
      }),
    );

    sv.file(
      `${directory.lib}/@sjsf/sv/HelloComponent.svelte`,
      transforms.svelteScript({ language }, ({ ast, svelte, js }) => {
        js.imports.addDefault(ast.instance.content, {
          as: "content",
          from: "./content.txt?raw",
        });

        svelte.addFragment(ast, "<p>{content}</p>");
        svelte.addFragment(ast, `<h2>Hello ${options.who}!</h2>`);
      }),
    );

    sv.file(
      directory.kitRoutes + "/+page.svelte",
      transforms.svelteScript({ language }, ({ ast, svelte, js }) => {
        js.imports.addDefault(ast.instance.content, {
          as: "HelloComponent",
          from: `$lib/@sjsf/sv/HelloComponent.svelte`,
        });

        svelte.addFragment(ast, "<HelloComponent />");
      }),
    );
  },
});
