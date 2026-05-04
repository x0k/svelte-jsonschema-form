import {
  iconSetAtRules,
  themeOrSubThemeAtRules,
  type AtRule,
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
  let uiLibIsNotConfigured = false;

  sv.file(
    file.stylesheet,
    transforms.css(({ ast, css }) => {
      uiLibIsNotConfigured = isStyleSheetEmpty(ast);
      const nodeModulesPath = file.getRelative({
        from: file.stylesheet,
        to: "node_modules",
      });
      const atRuleOptions: AtRuleOptions = {
        nodeModulesPath,
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
      if (!uiLibIsNotConfigured) {
        return;
      }
      if (themeOrSubTheme === "daisyui5") {
        css.addAtRule(ast, {
          name: "plugin",
          params: '"daisyui"',
          append: true,
        });
      } else if (themeOrSubTheme === "flowbite3") {
        // @plugin 'flowbite/plugin';
        // @custom-variant dark (&:where(.dark, .dark *));
        css.addAtRule(ast, {
          name: "plugin",
          params: '"flowbite/plugin"',
          append: true,
        });
        css.addAtRule(ast, {
          name: "custom-variant",
          params: "dark (&:where(.dark, .dark *))",
          append: true,
        });
        css.addAtRule(ast, {
          name: "theme",
          params: `{
  --color-primary-50: #fff5f2;
  --color-primary-100: #fff1ee;
  --color-primary-200: #ffe4de;
  --color-primary-300: #ffd5cc;
  --color-primary-400: #ffbcad;
  --color-primary-500: #fe795d;
  --color-primary-600: #ef562f;
  --color-primary-700: #eb4f27;
  --color-primary-800: #cc4522;
  --color-primary-900: #a5371b;

  --color-secondary-50: #f0f9ff;
  --color-secondary-100: #e0f2fe;
  --color-secondary-200: #bae6fd;
  --color-secondary-300: #7dd3fc;
  --color-secondary-400: #38bdf8;
  --color-secondary-500: #0ea5e9;
  --color-secondary-600: #0284c7;
  --color-secondary-700: #0369a1;
  --color-secondary-800: #075985;
  --color-secondary-900: #0c4a6e;
}`,
          append: true,
        });
        css.addAtRule(ast, {
          name: "source",
          params: `"${nodeModulesPath}/flowbite-svelte/dist"`,
          append: true,
        });
      } else if (themeOrSubTheme === "skeleton4") {
        css.addAtRule(ast, {
          name: "import",
          params: '"@skeletonlabs/skeleton"',
          append: true,
        });
        css.addAtRule(ast, {
          name: "import",
          params: '"@skeletonlabs/skeleton-svelte"',
          append: true,
        });
        css.addAtRule(ast, {
          name: "import",
          params: '"@skeletonlabs/skeleton/themes/cerberus"',
          append: true,
        });
      }
    }),
  );

  if (uiLibIsNotConfigured) {
    if (themeOrSubTheme === "skeleton4") {
      // https://github.com/sveltejs/cli/blob/19ed7a0f940816a63c1c7f963a04bb72d7b19a8f/packages/sv/src/addons/paraglide.ts#L148
      sv.file(
        "src/app.html",
        transforms.html(({ ast, html }) => {
          const htmlNode = ast.nodes.find(
            (child): child is SvelteAst.RegularElement =>
              child.type === "RegularElement" && child.name === "html",
          );
          if (!htmlNode) {
            console.warn(
              "Could not find <html> node in app.html. You'll need to add the language placeholder manually",
            );
            return false;
          }
          html.addAttribute(htmlNode, "data-theme", "cerberus");
        }),
      );
    }
  }

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

const INITIAL_AT_RULES = [
  { name: "import", params: "tailwindcss" },
  { name: "plugin", params: "@tailwindcss/forms" },
  { name: "plugin", params: "@tailwindcss/typography" },
] satisfies AtRule[];

function isStyleSheetEmpty(
  ast: Omit<SvelteAst.CSS.StyleSheetBase, "attributes" | "content">,
) {
  for (const c of ast.children) {
    if (
      c.type !== "Atrule" ||
      INITIAL_AT_RULES.findIndex(
        (r) => r.name === c.name && c.prelude.includes(r.params),
      ) < 0
    ) {
      return false;
    }
  }
  return true;
}
