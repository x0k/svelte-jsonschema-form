import {
  iconSetAtRules,
  themeOrSubThemeAtRules,
  type AtRule,
  type AtRuleOptions,
} from "meta";

import type { Context } from "./model.js";
import {
  type SvelteAst,
  transforms,
  js as jsUtils,
  cssAddPseudoRule,
} from "./sv-utils.js";
import { SET_SHADCN_THEME_CONTEXT_FN_NAME } from "./shadcn.js";

export function appCss(ctx: Context) {
  const {
    file,
    sv,
    options: { themeOrSubTheme, icons },
    isKit,
    directory,
    dependencyVersion,
    language,
  } = ctx;
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
      } else if (themeOrSubTheme.startsWith("shadcn")) {
        css.addAtRule(ast, {
          name: "custom-variant",
          params: "dark (&:where(.dark *))",
          append: true,
        });

        const rootSelector = cssAddPseudoRule(ast, { selector: "root" });
        const rootProperties = [
          { property: "--radius", value: "0.625rem" },
          { property: "--background", value: "oklch(1 0 0)" },
          { property: "--foreground", value: "oklch(0.145 0 0)" },
          { property: "--card", value: "oklch(1 0 0)" },
          { property: "--card-foreground", value: "oklch(0.145 0 0)" },
          { property: "--popover", value: "oklch(1 0 0)" },
          { property: "--popover-foreground", value: "oklch(0.145 0 0)" },
          { property: "--primary", value: "oklch(0.205 0 0)" },
          { property: "--primary-foreground", value: "oklch(0.985 0 0)" },
          { property: "--secondary", value: "oklch(0.97 0 0)" },
          { property: "--secondary-foreground", value: "oklch(0.205 0 0)" },
          { property: "--muted", value: "oklch(0.97 0 0)" },
          { property: "--muted-foreground", value: "oklch(0.556 0 0)" },
          { property: "--accent", value: "oklch(0.97 0 0)" },
          { property: "--accent-foreground", value: "oklch(0.205 0 0)" },
          { property: "--destructive", value: "oklch(0.577 0.245 27.325)" },
          { property: "--border", value: "oklch(0.922 0 0)" },
          { property: "--input", value: "oklch(0.922 0 0)" },
          { property: "--ring", value: "oklch(0.708 0 0)" },
          { property: "--chart-1", value: "oklch(0.646 0.222 41.116)" },
          { property: "--chart-2", value: "oklch(0.6 0.118 184.704)" },
          { property: "--chart-3", value: "oklch(0.398 0.07 227.392)" },
          { property: "--chart-4", value: "oklch(0.828 0.189 84.429)" },
          { property: "--chart-5", value: "oklch(0.769 0.188 70.08)" },
          { property: "--sidebar", value: "oklch(0.985 0 0)" },
          { property: "--sidebar-foreground", value: "oklch(0.145 0 0)" },
          { property: "--sidebar-primary", value: "oklch(0.205 0 0)" },
          {
            property: "--sidebar-primary-foreground",
            value: "oklch(0.985 0 0)",
          },
          { property: "--sidebar-accent", value: "oklch(0.97 0 0)" },
          {
            property: "--sidebar-accent-foreground",
            value: "oklch(0.205 0 0)",
          },
          { property: "--sidebar-border", value: "oklch(0.922 0 0)" },
          { property: "--sidebar-ring", value: "oklch(0.708 0 0)" },
        ];
        for (const p of rootProperties) {
          css.addDeclaration(rootSelector, p);
        }

        const darkSelector = css.addRule(ast, { selector: "dark" });
        const darkProperties = [
          { property: "--background", value: "oklch(0.145 0 0)" },
          { property: "--foreground", value: "oklch(0.985 0 0)" },
          { property: "--card", value: "oklch(0.205 0 0)" },
          { property: "--card-foreground", value: "oklch(0.985 0 0)" },
          { property: "--popover", value: "oklch(0.269 0 0)" },
          { property: "--popover-foreground", value: "oklch(0.985 0 0)" },
          { property: "--primary", value: "oklch(0.922 0 0)" },
          { property: "--primary-foreground", value: "oklch(0.205 0 0)" },
          { property: "--secondary", value: "oklch(0.269 0 0)" },
          { property: "--secondary-foreground", value: "oklch(0.985 0 0)" },
          { property: "--muted", value: "oklch(0.269 0 0)" },
          { property: "--muted-foreground", value: "oklch(0.708 0 0)" },
          { property: "--accent", value: "oklch(0.371 0 0)" },
          { property: "--accent-foreground", value: "oklch(0.985 0 0)" },
          { property: "--destructive", value: "oklch(0.704 0.191 22.216)" },
          { property: "--border", value: "oklch(1 0 0 / 10%)" },
          { property: "--input", value: "oklch(1 0 0 / 15%)" },
          { property: "--ring", value: "oklch(0.556 0 0)" },
          { property: "--chart-1", value: "oklch(0.488 0.243 264.376)" },
          { property: "--chart-2", value: "oklch(0.696 0.17 162.48)" },
          { property: "--chart-3", value: "oklch(0.769 0.188 70.08)" },
          { property: "--chart-4", value: "oklch(0.627 0.265 303.9)" },
          { property: "--chart-5", value: "oklch(0.645 0.246 16.439)" },
          { property: "--sidebar", value: "oklch(0.205 0 0)" },
          { property: "--sidebar-foreground", value: "oklch(0.985 0 0)" },
          {
            property: "--sidebar-primary",
            value: "oklch(0.488 0.243 264.376)",
          },
          {
            property: "--sidebar-primary-foreground",
            value: "oklch(0.985 0 0)",
          },
          { property: "--sidebar-accent", value: "oklch(0.269 0 0)" },
          {
            property: "--sidebar-accent-foreground",
            value: "oklch(0.985 0 0)",
          },
          { property: "--sidebar-border", value: "oklch(1 0 0 / 10%)" },
          { property: "--sidebar-ring", value: "oklch(0.439 0 0)" },
        ];
        for (const p of darkProperties) {
          css.addDeclaration(darkSelector, p);
        }

        css.addAtRule(ast, {
          name: "theme",
          params: `inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}`,
          append: true,
        });
        css.addAtRule(ast, {
          name: "layer",
          params: `base {
  * {
    @apply border-border outline-ring/50;
  }
 
  body {
    @apply bg-background text-foreground;
  }
}`,
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

        setupShadcnContext(ctx, ast.instance, js);

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

        setupShadcnContext(ctx, ast.instance, js);
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

function setupShadcnContext(
  { lib, options: { themeOrSubTheme } }: Context,
  instance: SvelteAst.Script,
  js: typeof jsUtils,
) {
  if (themeOrSubTheme !== "shadcn4" && themeOrSubTheme !== "shadcn-extras") {
    return;
  }
  js.imports.addNamed(instance.content, {
    imports: [SET_SHADCN_THEME_CONTEXT_FN_NAME],
    from: lib("sjsf/shadcn"),
  });
  const statement = js.common.parseStatement(
    `${SET_SHADCN_THEME_CONTEXT_FN_NAME}();`,
  );
  js.common.appendStatement(instance.content, { statement });
}
