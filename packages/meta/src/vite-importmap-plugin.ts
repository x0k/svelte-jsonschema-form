import * as fs from "node:fs";
import * as path from "node:path/posix";

import { build as rolldownBuild } from "rolldown";
import type { Plugin, ResolvedConfig } from "vite";

const PLUGIN_NAME = "vite-importmap";

interface ImportMapPluginOptions {
  imports: Record<string, string>;
}

function normalizeDepName(dep: string): string {
  return dep.replace(/[/\\]/g, "_");
}

export function importMapPlugin(options: ImportMapPluginOptions): Plugin[] {
  const entries = Object.entries(options.imports);
  const resolvedMap = new Map<string, string>();
  const resolvedIds = new Map<string, string>();
  let config: ResolvedConfig;

  const devPlugin: Plugin = {
    name: `${PLUGIN_NAME}:dev`,
    apply: "serve",
    configResolved(_config) {
      config = _config;
    },
    transformIndexHtml: {
      order: "pre",
      async handler(_, { server }) {
        if (!server) return;
        const clientEnv = server.environments.client;

        for (const [specifier, id] of entries) {
          const resolved = await clientEnv.pluginContainer.resolveId(id);
          if (resolved) {
            resolvedIds.set(specifier, resolved.id);
            const url = `/@id/${encodeURIComponent(resolved.id)}`;
            resolvedMap.set(specifier, url);
          }
        }

        return {
          html: "",
          tags: [
            {
              tag: "script",
              attrs: { type: "importmap" },
              children: JSON.stringify({
                imports: Object.fromEntries(resolvedMap),
              }),
              injectTo: "head-prepend",
            },
          ],
        };
      },
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) return next();

        const parsedUrl = new URL(
          req.url,
          `http://${req.headers.host || "localhost"}`
        );

        for (const [specifier] of entries) {
          const importMapUrl = resolvedMap.get(specifier);
          if (!importMapUrl) continue;

          if (parsedUrl.pathname === importMapUrl) {
            const id = resolvedIds.get(specifier);
            if (!id) return next();

            try {
              const result =
                await server.environments.client.transformRequest(id);
              if (result) {
                res.setHeader("Content-Type", "application/javascript");
                res.end(result.code);
                return;
              }
            } catch {
              // fall through to next middleware
            }
          }
        }
        next();
      });
    },
  };

  const buildPlugin: Plugin = {
    name: `${PLUGIN_NAME}:build`,
    apply: "build",
    configResolved(_config) {
      config = _config;
    },
    async buildStart() {
      for (const [specifier, id] of entries) {
        const normalized = normalizeDepName(specifier);
        const result = await rolldownBuild({
          input: [id],
          output: {
            format: "esm",
            minify: false,
            exports: "named",
          },
        });

        for (const output of result.output) {
          if (output.type === "chunk" && output.isEntry) {
            const assetFileName = `${normalized}.js`;
            this.emitFile({
              type: "asset",
              fileName: assetFileName,
              source: output.code,
            });
            resolvedMap.set(specifier, `./${assetFileName}`);
          }
        }
      }

      const importMapJson = JSON.stringify(
        { imports: Object.fromEntries(resolvedMap) },
        null,
        2
      );

      this.emitFile({
        type: "asset",
        fileName: "import-map.json",
        source: importMapJson,
      });
    },
    writeBundle(options) {
      const outDir = options.dir || path.resolve(config.root, "dist");
      const base = config.base || "/";
      const importMap: Record<string, string> = {};
      for (const [key, url] of resolvedMap) {
        importMap[key] = url.startsWith(".") ? base + url.slice(2) : url;
      }
      const importMapJson = JSON.stringify({ imports: importMap }, null, 2);

      const importMapScript = `<script type="importmap">${importMapJson}</script>`;

      const htmlFile = path.join(outDir, "index.html");
      if (fs.existsSync(htmlFile)) {
        let html = fs.readFileSync(htmlFile, "utf-8");
        html = html.replace("<head>", `<head>\n${importMapScript}`);
        fs.writeFileSync(htmlFile, html);
      }
    },
  };

  return [devPlugin, buildPlugin];
}
