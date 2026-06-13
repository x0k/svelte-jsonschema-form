import type { Loader, LoaderContext } from "astro/loaders";
import { docsLoader } from "@astrojs/starlight/loaders";
import { createSatteriMarkdownProcessor } from "@astrojs/markdown-satteri";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { discoverChangelogs } from "./changelog-discovery";

export function changelogsLoader(): Loader {
  const inner = docsLoader();
  return {
    name: "starlight-docs-with-changelogs",
    load: async (context: LoaderContext) => {
      await inner.load(context);
      const monorepoRoot = fileURLToPath(new URL("../..", context.config.root));
      const processor = await createSatteriMarkdownProcessor();
      for (const cl of discoverChangelogs(monorepoRoot)) {
        const absPath = join(monorepoRoot, cl.filePath);
        const raw = readFileSync(absPath, "utf-8");
        const content = raw.replace(/^#\s+[^\n]*\n+/, "");
        const { code: html } = await processor.render(content);
        const data = await context.parseData({
          id: cl.id,
          data: { title: cl.title, type: "base" },
        });
        context.store.set({
          id: cl.id,
          data,
          filePath: `src/content/docs/${cl.id}.md`,
          rendered: { html },
        });
      }
    },
  } satisfies Loader;
}
