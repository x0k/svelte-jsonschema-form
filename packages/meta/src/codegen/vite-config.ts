import { transforms } from "@sveltejs/sv-utils";

import { iconSetPackage } from "../icons.ts";
import { isTailwindcss4Theme, themePackage, toTheme } from "../themes.ts";
import type {
  CodegenIconSet,
  CodegenSvelteKitIntegration,
  CodegenThemeOrSubTheme,
} from "./model.ts";

export interface ViteConfigOptions {
  themeOrSubTheme: CodegenThemeOrSubTheme;
  icons: CodegenIconSet;
  sveltekit: CodegenSvelteKitIntegration;
}

const SSR_SAFE_DEPS = new Set(["@sjsf/form", "svelte", "tailwind-merge"]);

export function createViteConfig({
  themeOrSubTheme,
  icons,
  sveltekit,
}: ViteConfigOptions) {
  return transforms.script(({ ast, js, comments }) => {
    const theme = toTheme(themeOrSubTheme);
    const config = js.vite.getConfig(ast);

    if (isTailwindcss4Theme(theme)) {
      js.imports.addDefault(ast, {
        as: "tailwindcss",
        from: "@tailwindcss/vite",
      });
      js.vite.addPlugin(ast, {
        code: "tailwindcss()",
        mode: "append",
      });
    }

    const packages = new Set<string>();
    if (icons && icons !== "none") {
      for (const dep of iconSetPackage(icons).dependencies) {
        if (!SSR_SAFE_DEPS.has(dep.name)) packages.add(dep.name);
      }
    }
    if (
      themePackage(theme).dependencies.some((d) => d.name === "@lucide/svelte")
    ) {
      packages.add("@lucide/svelte");
    }
    if (packages.size > 0) {
      const ssr = js.vite.configProperty(ast, config, {
        name: "ssr",
        fallback: js.object.create({}),
      });
      const noExternal = js.object.property(ssr, {
        name: "noExternal",
        fallback: js.array.create(),
      });
      for (const pkg of packages) js.array.append(noExternal, pkg);
    }

    if (sveltekit === "remoteFunctions") {
      const optimizeDeps = js.vite.configProperty(ast, config, {
        name: "optimizeDeps",
        fallback: js.object.create({}),
      });
      const exclude = js.object.property(optimizeDeps, {
        name: "exclude",
        fallback: js.array.create(),
      });
      comments.add(exclude, {
        type: "Line",
        value: " https://github.com/sveltejs/kit/issues/14788",
      });
      js.array.append(exclude, "@sjsf/form");
      js.array.append(exclude, "@sjsf/sveltekit/rf/client");
    }
  });
}
