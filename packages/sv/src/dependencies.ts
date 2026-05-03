import {
  externalValidatorPackage,
  extraPackage,
  filterPackageDependencies,
  formPackage,
  iconSetPackage,
  isInternalValidator,
  isSubTheme,
  sveltekitPackage,
  optionalPackageName,
  subThemeDependencies,
  themePackage,
  themeParent,
  type AbstractPackage,
  type IncludeOptional,
  type PackageDependency,
  isJsonSchemaValidator,
  isTailwindcss4Theme,
  tailwindcss4ThemePlugins,
  type Tailwindcss4Plugin,
  tailwindcss4PluginPackage,
} from "meta";

import {
  isEndsWithPrecompiled,
  withoutPrecompiledSuffix,
  type Context,
} from "./model.js";
import { pnpm, transforms } from "./sv-utils.js";

export function dependencies(ctx: Context) {
  const { sv, options } = ctx;
  function addDependency({ name, version, dev }: AbstractPackage) {
    if (dev) {
      sv.devDependency(name, version);
    } else {
      sv.dependency(name, version);
    }
  }
  function addDependencies(
    deps: Iterable<PackageDependency>,
    filter: IncludeOptional = false,
  ) {
    for (const d of filterPackageDependencies(deps, filter)) {
      addDependency(d);
    }
  }
  const { themeOrSubTheme, validatorWithSuffix, icons, sveltekit } = options;
  // Form
  addDependency(formPackage);
  // Theme
  const theme = isSubTheme(themeOrSubTheme)
    ? themeParent(themeOrSubTheme)
    : themeOrSubTheme;
  const themePkg = themePackage(theme);
  addDependency(themePkg);
  addDependencies(themePkg.dependencies, [
    // daisyui5
    optionalPackageName("pikaday"),
    // skeleton4
    optionalPackageName("skeletonSvelte"),
    // shadcn4
    optionalPackageName("internationalizedDate"),
  ]);
  if (isSubTheme(themeOrSubTheme)) {
    addDependencies(subThemeDependencies(themeOrSubTheme));
  }
  if (isTailwindcss4Theme(theme)) {
    dependenciesTailwindCss4(ctx, tailwindcss4ThemePlugins(theme));
  }
  if (
    isEndsWithPrecompiled(validatorWithSuffix) ||
    !isInternalValidator(validatorWithSuffix)
  ) {
    // Validator
    const validator = withoutPrecompiledSuffix(validatorWithSuffix);
    const validatorPkg = externalValidatorPackage(validator);
    addDependency(validatorPkg);
    addDependencies(validatorPkg.dependencies);
    if (validator === "ajv8") {
      addDependency(extraPackage("ajvFormat"));
    }
    if (validatorWithSuffix === "ajv8-precompiled") {
      addDependency(extraPackage("esbuild"));
    }
    if (validatorWithSuffix === "hyperjump-precompiled") {
      addDependency(extraPackage("devalue"));
    }
  } else {
    if (validatorWithSuffix === "standard-schema") {
      addDependencies(formPackage.dependencies, [
        optionalPackageName("standardSchemaSpec"),
      ]);
    }
  }
  // Icons
  if (icons !== "none") {
    const iconsPkg = iconSetPackage(icons);
    addDependency(iconsPkg);
    addDependencies(iconsPkg.dependencies);
  }
  // Type inference
  if (isJsonSchemaValidator(withoutPrecompiledSuffix(validatorWithSuffix))) {
    addDependency(extraPackage("jsonSchemaToTs"));
  }
  // Kit integration
  if (sveltekit !== "no") {
    addDependency(sveltekitPackage);
    addDependencies(sveltekitPackage.dependencies);
  }
}

// https://github.com/sveltejs/cli/blob/19ed7a0f940816a63c1c7f963a04bb72d7b19a8f/packages/sv/src/addons/tailwindcss.ts#L33
function dependenciesTailwindCss4(
  {
    sv,
    file,
    isKit,
    directory,
    dependencyVersion,
    language,
    packageManager,
  }: Context,
  plugins: Iterable<Tailwindcss4Plugin>,
) {
  const prettierInstalled = Boolean(dependencyVersion("prettier"));

  sv.devDependency("tailwindcss", "^4.2.2");
  sv.devDependency("@tailwindcss/vite", "^4.2.2");
  if (packageManager === "pnpm") {
    sv.file(
      file.findUp("pnpm-workspace.yaml"),
      pnpm.allowBuilds("@tailwindcss/oxide"),
    );
  }

  if (prettierInstalled)
    sv.devDependency("prettier-plugin-tailwindcss", "^0.7.2");

  for (const plugin of plugins) {
    const pkg = tailwindcss4PluginPackage(plugin);
    sv.devDependency(pkg.name, pkg.version);
  }

  // add the vite plugin
  sv.file(
    file.viteConfig,
    transforms.script(({ ast, js }) => {
      const vitePluginName = "tailwindcss";
      js.imports.addDefault(ast, {
        as: vitePluginName,
        from: "@tailwindcss/vite",
      });
      js.vite.addPlugin(ast, { code: `${vitePluginName}()`, mode: "prepend" });
    }),
  );

  sv.file(
    file.stylesheet,
    transforms.css(({ ast, css }) => {
      // since we are prepending all the `AtRule` let's add them in reverse order,
      // so they appear in the expected order in the final file

      for (const plugin of plugins) {
        const pkg = tailwindcss4PluginPackage(plugin);
        css.addAtRule(ast, {
          name: "plugin",
          params: `'${pkg.name}'`,
          append: false,
        });
      }

      css.addAtRule(ast, {
        name: "import",
        params: `'tailwindcss'`,
        append: false,
      });
    }),
  );

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
      }),
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
      }),
    );
  }

  sv.file(
    ".vscode/settings.json",
    transforms.json(({ data }) => {
      data["files.associations"] ??= {};
      data["files.associations"]["*.css"] = "tailwindcss";
    }),
  );

  sv.file(
    ".vscode/extensions.json",
    transforms.json(({ data, json }) => {
      json.arrayUpsert(data, "recommendations", "bradlc.vscode-tailwindcss");
    }),
  );

  if (prettierInstalled) {
    sv.file(
      ".prettierrc",
      transforms.json(({ data, json }) => {
        json.arrayUpsert(data, "plugins", "prettier-plugin-tailwindcss");
        data.tailwindStylesheet ??= file.getRelative({ to: file.stylesheet });
      }),
    );
  }
}
