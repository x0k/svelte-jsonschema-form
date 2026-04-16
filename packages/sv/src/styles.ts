import { transforms } from "@sveltejs/sv-utils";
import type { Context } from "./model.js";

export function appCss({ language, sv, directory, options, isKit }: Context) {
  sv.file(
    isKit
      ? `${directory.kitRoutes}/+layout.svelte`
      : `${directory.src}/App.svelte`,
    transforms.svelteScript({ language }, () => {}),
  );
}
