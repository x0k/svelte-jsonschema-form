import {
  iconSetAtRules,
  themeOrSubThemeAtRules,
  type AtRuleOptions,
} from "meta";

import type { Context } from "./model.js";
import { type SvelteAst, transforms } from "./sv-utils.js";

export function appCss({
  file,
  sv,
  options: { themeOrSubTheme, icons },
  isKit,
  directory,
  dependencyVersion,
  language,
}: Context) {
  sv.file(
    file.stylesheet,
    transforms.css(({ ast, css }) => {
      const isEmpty = isStyleSheetEmpty(ast);
      const atRuleOptions: AtRuleOptions = {
        nodeModulesPath: file.getRelative({
          from: file.stylesheet,
          to: "node_modules",
        }),
      };
      let rules = themeOrSubThemeAtRules(themeOrSubTheme, atRuleOptions);
      if (icons !== "none") {
        rules = rules.concat(iconSetAtRules(icons, atRuleOptions));
      }
      const imports: string[] = [];
      for (const atRule of rules) {
        if (atRule.name === "import") {
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
      if (!isEmpty) {
        return;
      }
      if (themeOrSubTheme === "daisyui5") {
        css.addAtRule(ast, {
          name: "plugin",
          params: '"daisyui"',
          append: true,
        });
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

function isStyleSheetEmpty(
  ast: Omit<SvelteAst.CSS.StyleSheetBase, "attributes" | "content">,
) {
  if (ast.children.length === 0) {
    return true;
  }
  if (ast.children.length === 1) {
    const child = ast.children[0]!;
    if (
      child.type === "Atrule" &&
      child.name === "import" &&
      child.prelude.includes("tailwindcss")
    ) {
      return true;
    }
  }
  return false;
}
