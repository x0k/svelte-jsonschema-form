import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { parse, walk, generate } from "css-tree";

import type { PlaygroundTheme } from "../src/playground/model.ts";

const ROOT_DIR = path.join(import.meta.dirname, "../../..");
const META_DIR = path.join(import.meta.dirname, "..");

interface ThemeCssSource {
  files: string[];
  append?: string;
}

const THEME_CSS_SOURCES: Record<PlaygroundTheme, ThemeCssSource> = {
  basic: {
    files: ["packages/basic-theme/dist/css/basic.css"],
  },
  pico: {
    files: [
      "node_modules/@picocss/pico/css/pico.css",
      "packages/basic-theme/dist/css/pico.css",
    ],
  },
  beercss: {
    files: ["node_modules/beercss/dist/cdn/beer.min.css"],
    get append() {
      return beerCssSettings;
    },
  },
  daisyui5: {
    files: ["packages/daisyui5-theme/dist/styles.css"],
  },
  flowbite3: {
    files: ["packages/flowbite3-theme/dist/styles.css"],
  },
  skeleton4: {
    files: ["packages/skeleton4-theme/dist/styles.css"],
  },
  shadcn4: {
    files: ["packages/shadcn4-theme/dist/styles.css"],
  },
  svar: {
    files: [],
  },
  "shadcn-extras": {
    files: ["lab/shadcn-extras-theme/dist/styles.css"],
  },
};

const beerCssSettings = `
:host {
  --size: 1rem;
  --font: Inter, Roboto, "Helvetica Neue", "Arial Nova", "Nimbus Sans", Noto Sans, Arial, sans-serif;
  --font-icon: "Material Symbols Outlined";
  --speed1: 0.1s;
  --speed2: 0.2s;
  --speed3: 0.3s;
  --speed4: 0.4s;
  --active: rgb(128 128 128 / 0.192);
  --overlay: rgb(0 0 0 / 0.5);
  --elevate1: 0 0.125rem 0.125rem 0 rgb(0 0 0 / 0.32);
  --elevate2: 0 0.25rem 0.5rem 0 rgb(0 0 0 / 0.4);
  --elevate3: 0 0.375rem 0.75rem 0 rgb(0 0 0 / 0.48);
  --top: env(safe-area-inset-top);
  --bottom: env(safe-area-inset-bottom);
  --left: env(safe-area-inset-left);
  --right: env(safe-area-inset-right);
}
:host, .light {
  --primary: #6750a4;
  --on-primary: #ffffff;
  --primary-container: #e9ddff;
  --on-primary-container: #22005d;
  --secondary: #625b71;
  --on-secondary: #ffffff;
  --secondary-container: #e8def8;
  --on-secondary-container: #1e192b;
  --tertiary: #7e5260;
  --on-tertiary: #ffffff;
  --tertiary-container: #ffd9e3;
  --on-tertiary-container: #31101d;
  --error: #ba1a1a;
  --on-error: #ffffff;
  --error-container: #ffdad6;
  --on-error-container: #410002;
  --background: #fffbff;
  --on-background: #1c1b1e;
  --surface: #fdf8fd;
  --on-surface: #1c1b1e;
  --surface-variant: #e7e0eb;
  --on-surface-variant: #49454e;
  --outline: #7a757f;
  --outline-variant: #cac4cf;
  --shadow: #000000;
  --scrim: #000000;
  --inverse-surface: #313033;
  --inverse-on-surface: #f4eff4;
  --inverse-primary: #cfbcff;
  --surface-dim: #ddd8dd;
  --surface-bright: #fdf8fd;
  --surface-container-lowest: #ffffff;
  --surface-container-low: #f7f2f7;
  --surface-container: #f2ecf1;
  --surface-container-high: #ece7eb;
  --surface-container-highest: #e6e1e6;
}
.dark {
  --primary: #cfbcff;
  --on-primary: #381e72;
  --primary-container: #4f378a;
  --on-primary-container: #e9ddff;
  --secondary: #cbc2db;
  --on-secondary: #332d41;
  --secondary-container: #4a4458;
  --on-secondary-container: #e8def8;
  --tertiary: #efb8c8;
  --on-tertiary: #4a2532;
  --tertiary-container: #633b48;
  --on-tertiary-container: #ffd9e3;
  --error: #ffb4ab;
  --on-error: #690005;
  --error-container: #93000a;
  --on-error-container: #ffb4ab;
  --background: #1c1b1e;
  --on-background: #e6e1e6;
  --surface: #141316;
  --on-surface: #e6e1e6;
  --surface-variant: #49454e;
  --on-surface-variant: #cac4cf;
  --outline: #948f99;
  --outline-variant: #49454e;
  --shadow: #000000;
  --scrim: #000000;
  --inverse-surface: #e6e1e6;
  --inverse-on-surface: #313033;
  --inverse-primary: #6750a4;
  --surface-dim: #141316;
  --surface-bright: #3a383c;
  --surface-container-lowest: #0f0e11;
  --surface-container-low: #1c1b1e;
  --surface-container: #201f22;
  --surface-container-high: #2b292d;
  --surface-container-highest: #363438;
}`;

function extractPropertyDeclarations(cssContent: string): {
  properties: string;
  remainingStyles: string;
} {
  if (!cssContent) return { properties: "", remainingStyles: "" };

  try {
    const ast = parse(cssContent, {
      parseRulePrelude: false,
      parseCustomProperty: true,
      parseValue: false,
    });

    const propertyNodes: any[] = [];
    const nodesToRemove: any[] = [];

    walk(ast, (node: any, item: any, list: any) => {
      if (node.type === "Atrule" && node.name === "property") {
        propertyNodes.push(node);
        nodesToRemove.push({ node, item, list });
      }
    });

    nodesToRemove.forEach(({ item, list }) => {
      if (list && item) {
        list.remove(item);
      }
    });

    const properties = propertyNodes.map((node) => generate(node)).join("\n\n");
    const remainingStyles = generate(ast).trim();

    return { properties, remainingStyles };
  } catch {
    const propertyRegex = /@property\s+[^{]+\{[^}]*\}/g;
    const properties = cssContent.match(propertyRegex) || [];
    const remainingStyles = cssContent.replace(propertyRegex, "").trim();

    return {
      properties: properties.join("\n"),
      remainingStyles,
    };
  }
}

async function readThemeCss({
  files,
  append,
}: ThemeCssSource): Promise<string> {
  const parts: string[] = [];

  for (const file of files) {
    let filePath: string;
    if (file.startsWith("node_modules/")) {
      const specifier = file.slice("node_modules/".length);
      const resolved = await import.meta.resolve(specifier);
      filePath = fileURLToPath(resolved);
    } else {
      filePath = path.join(ROOT_DIR, file);
    }
    const content = await fs.readFile(filePath, { encoding: "utf-8" });
    parts.push(content);
  }

  if (append) {
    parts.push(append);
  }

  return parts.join("\n");
}

async function main() {
  const themeStyles: Record<string, string> = {};
  const globalThemeStyles: Record<string, string> = {};

  for (const [theme, source] of Object.entries(THEME_CSS_SOURCES)) {
    const fullCss = await readThemeCss(source);
    const { properties, remainingStyles } =
      extractPropertyDeclarations(fullCss);

    themeStyles[theme] = remainingStyles;
    globalThemeStyles[theme] = properties;
  }

  const content = `export const PLAYGROUND_SJSF_THEME_STYLES = ${JSON.stringify(themeStyles, null, 2)} as const;

export const PLAYGROUND_SJSF_GLOBAL_THEME_STYLES = ${JSON.stringify(globalThemeStyles, null, 2)} as const;
`;

  const outPath = path.join(
    META_DIR,
    "src/playground/theme-styles.generated.ts"
  );
  await fs.writeFile(outPath, content, "utf-8");
}

await main();
