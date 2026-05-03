import { transforms } from "@sveltejs/sv-utils";
import {
  iconSetAtRules,
  themeOrSubThemeAtRules,
  type AtRuleOptions,
} from "meta";

import type { Context } from "./model.js";

export function appCss({
  file,
  sv,
  options,
  isKit,
  directory,
  dependencyVersion,
  language,
}: Context) {
  sv.file(
    file.stylesheet,
    transforms.css(({ ast, css }) => {
      const atRuleOptions: AtRuleOptions = {
        nodeModulesPath: file.getRelative({
          from: file.stylesheet,
          to: "node_modules",
        }),
      };
      let rules = themeOrSubThemeAtRules(
        options.themeOrSubTheme,
        atRuleOptions,
      );
      if (options.icons !== "none") {
        rules = rules.concat(iconSetAtRules(options.icons, atRuleOptions));
      }
      const imports: string[] = [];
      for (const atRule of rules) {
        if (atRule.name === "import") {
          // TODO: Why?
          imports.push(`"${atRule.params}"`);
        } else {
          css.addAtRule(ast, {
            name: atRule.name,
            params: `"${atRule.params}"`,
            append: true,
          });
        }
      }
      if (imports.length > 0) {
        css.addImports(ast, { imports });
      }
    }),
  );

  // Connect stylesheet
  // https://github.com/sveltejs/cli/blob/a260374df2f24d440eb6f25841dcc89278a8e00d/packages/sv/src/addons/tailwindcss.ts#L84
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
}
