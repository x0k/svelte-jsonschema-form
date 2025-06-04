import packageJson from "%/basic-starter/package.json";
import svelteConfigJs from "%/basic-starter/svelte.config?raw";
import tsconfigJson from "%/basic-starter/tsconfig.json?raw";
import appHtml from "%/basic-starter/src/app.html?raw";
import type { Layer } from "../layer";

const files = {
  "svelte.config.js": svelteConfigJs,
  "tsconfig.json": tsconfigJson,
  "src/app.html": appHtml,
} as const;

export const layer = {
  package: packageJson,
  vite: {
    plugins: {
      "@sveltejs/kit/vite": {
        import: "{ sveltekit }",
        call: "sveltekit()",
      },
    },
    template: (plugins) => `import { defineConfig } from 'vite';
${Object.entries(plugins)
  .map(([pkg, p]) => `import ${p.import} from "${pkg}";`)
  .join("\n")}
export default defineConfig({
  plugins: [${Object.values(plugins)
    .map((p) => p.call)
    .join(", ")}]
})`,
  },
  files,
} satisfies Layer;
