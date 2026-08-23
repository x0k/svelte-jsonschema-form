import { defineConfig } from "jsrepo";

export default defineConfig({
  registries: ["@ieedan/shadcn-svelte-extras"],
  paths: {
    ui: "./src/lib/components/ui",
    hook: "./src/lib/hooks",
    action: "./src/lib/actions",
    util: "./src/lib/utils",
    lib: "./src/lib",
    component: "./src/lib/components",
  },
});
