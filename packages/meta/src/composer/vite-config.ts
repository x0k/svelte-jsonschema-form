export interface VitePluginConfig {
  import: string;
  call: string;
}

export interface ViteOptimizeDepsConfig {
  exclude?: string[];
}

export interface ViteResolveConfig {
  noExternal?: string[];
}

export interface ViteConfig {
  plugins?: Record<string, VitePluginConfig>;
  optimizeDeps?: ViteOptimizeDepsConfig;
  resolve?: ViteResolveConfig;
}

export function buildViteConfig({
  plugins = {},
  optimizeDeps = {},
  resolve = {},
}: ViteConfig): string {
  return `import { defineConfig } from 'vite';
${Object.entries(plugins)
  .map(([pkg, p]) => `import ${p.import} from "${pkg}";`)
  .join("\n")}
export default defineConfig({
  plugins: [${Object.values(plugins)
    .map((p) => p.call)
    .join(", ")}],
  optimizeDeps: ${JSON.stringify(optimizeDeps)},
  resolve: ${JSON.stringify(resolve)}
})`;
}
