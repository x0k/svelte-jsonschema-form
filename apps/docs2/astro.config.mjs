// @ts-check
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import svelte from "@astrojs/svelte";
// Disabled until satteri support is available
// import starlightLinksValidator from "starlight-links-validator";
import { defineMdastPlugin } from "satteri";
import { satteri } from "@astrojs/markdown-satteri";
import starlightLlmsTxt from "starlight-llms-txt";

import { discoverChangelogSlugs } from "./src/loaders/changelog-discovery";

const base = "/svelte-jsonschema-form/";

const basePathPlugin = defineMdastPlugin({
  name: "base-path",
  link(node, ctx) {
    if (node.url.startsWith("/") && !node.url.startsWith(base)) {
      ctx.setProperty(node, "url", base + node.url.slice(1));
    }
  },
});

const projectRoot = fileURLToPath(new URL("../..", import.meta.url));
const changelogItems = discoverChangelogSlugs(projectRoot);

// https://astro.build/config
export default defineConfig({
  site: "https://x0k.github.io",
  base,
  trailingSlash: "always",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  integrations: [
    svelte(),
    starlight({
      // favicon: "src/assets/logo.svg",
      plugins: [
        starlightLlmsTxt({
          rawContent: true,
          exclude: ["404", "changelogs/**", "examples/**"],
        }),
      ].concat(
        process.env.CHECK_LINKS
          ? [
              // starlightLinksValidator()
            ]
          : []
      ),
      title: "svelte-jsonschema-form v3",
      // logo: {
      //   src: "./src/assets/logo.svg",
      // },
      social: [
        {
          icon: "github",
          href: "https://github.com/x0k/svelte-jsonschema-form",
          label: "GitHub",
        },
        {
          icon: "discord",
          href: "https://discord.gg/hVxFWk7dRn",
          label: "Discord",
        },
      ],
      head: [
        {
          tag: "script",
          attrs: {
            "data-goatcounter": "https://sjsf.counter.x0k.dev/count",
            async: true,
            src: "https://sjsf.counter.x0k.dev/count.js",
          },
        },
      ],
      sidebar: [
        {
          label: "Guides",
          items: [{ autogenerate: { directory: "guides" } }],
        },
        {
          label: "Form",
          collapsed: true,
          items: [
            {
              autogenerate: { directory: "form" },
            },
          ],
        },
        {
          label: "Examples",
          items: [{ autogenerate: { directory: "examples" } }],
        },
        {
          label: "Themes",
          items: [{ autogenerate: { directory: "themes", collapsed: true } }],
        },
        {
          label: "Validators",
          items: [{ autogenerate: { directory: "validators" } }],
        },
        {
          label: "Integrations",
          items: [{ autogenerate: { directory: "integrations" } }],
        },
        {
          label: "Misc",
          items: [{ autogenerate: { directory: "misc" } }],
        },
        {
          label: "Changelogs",
          collapsed: true,
          items: changelogItems,
        },
        { label: "Documentation v2", link: "/v2/" },
      ],
      components: {
        // Head: "./src/components/custom-head.astro",
        Header: "./src/components/header-with-links.astro",
        // MarkdownContent: "./src/components/markdown-content.astro",
        PageTitle: "./src/components/page-title.astro",
      },
      customCss: ["./src/styles.css"],
    }),
  ],
  markdown: {
    processor: satteri({
      features: { directive: true, gfm: true },
      mdastPlugins: [basePathPlugin],
    }),
  },
  vite: {
    optimizeDeps: {
      exclude: ["@jis3r/icons"],
      include: ["bits-ui"],
    },
    resolve: {
      dedupe: ["bits-ui"],
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        examples: fileURLToPath(new URL("../../examples", import.meta.url)),
        pkgs: fileURLToPath(new URL("../../packages", import.meta.url)),
        legacy: fileURLToPath(new URL("../../legacy", import.meta.url)),
        lab: fileURLToPath(new URL("../../lab", import.meta.url)),
        apps: fileURLToPath(new URL("..", import.meta.url)),
      },
      noExternal: [
        "@lucide/svelte",
        "bits-ui",
        "runed",
        "svelte-toolbelt",
        "@skeletonlabs/skeleton-svelte",
      ],
    },
  },
});
