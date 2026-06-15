import { type AbstractPackage, isTailwindcss4Theme, toTheme } from "meta";
import { resolveDependencies } from "meta/codegen";

import { type Context } from "./model.js";
import { pnpm, transforms } from "./sv-utils.js";

export function dependencies(ctx: Context) {
  const { sv, options } = ctx;
  function addDependency({ name, version, dev }: AbstractPackage) {
    const v = `^${version}`;
    if (dev) {
      sv.devDependency(name, v);
    } else {
      sv.dependency(name, v);
    }
  }
  resolveDependencies({
    ...options,
    addDependency,
    widgets: [],
  });

  if (isTailwindcss4Theme(toTheme(options.themeOrSubTheme))) {
    dependenciesTailwindCss4(ctx);
  }
}

// https://github.com/sveltejs/cli/blob/19ed7a0f940816a63c1c7f963a04bb72d7b19a8f/packages/sv/src/addons/tailwindcss.ts#L33
function dependenciesTailwindCss4({
  sv,
  file,
  isKit,
  directory,
  dependencyVersion,
  language,
  packageManager,
}: Context) {
  if (packageManager === "pnpm") {
    sv.file(
      file.findUp("pnpm-workspace.yaml"),
      pnpm.allowBuilds("@tailwindcss/oxide")
    );
  }

  if (dependencyVersion("prettier")) {
    sv.devDependency("prettier-plugin-tailwindcss", "^0.7.2");
  }

  if (isKit) {
    const layoutSvelte = `${directory.kitRoutes}/+layout.svelte`;
    const stylesheetRelative = file.getRelative({
      from: layoutSvelte,
      to: file.stylesheet,
    });
    sv.file(
      layoutSvelte,
      transforms.svelteScript({ language }, ({ ast, svelte, js }) => {
        js.imports.addEmpty(ast.instance.content, { from: stylesheetRelative });

        if (ast.fragment.nodes.length === 0) {
          const svelteVersion = dependencyVersion("svelte");
          if (!svelteVersion)
            throw new Error("Failed to determine svelte version");
          svelte.addSlot(ast, { svelteVersion });
        }
      })
    );
  } else {
    const appSvelte = `${directory.src}/App.svelte`;
    const stylesheetRelative = file.getRelative({
      from: appSvelte,
      to: file.stylesheet,
    });
    sv.file(
      appSvelte,
      transforms.svelteScript({ language }, ({ ast, js }) => {
        js.imports.addEmpty(ast.instance.content, { from: stylesheetRelative });
      })
    );
  }

  sv.file(
    ".vscode/settings.json",
    transforms.json(({ data }) => {
      data["files.associations"] ??= {};
      data["files.associations"]["*.css"] = "tailwindcss";
    })
  );

  sv.file(
    ".vscode/extensions.json",
    transforms.json(({ data, json }) => {
      json.arrayUpsert(data, "recommendations", "bradlc.vscode-tailwindcss");
    })
  );
}
