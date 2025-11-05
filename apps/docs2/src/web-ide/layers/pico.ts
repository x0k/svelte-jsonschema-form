import packageJson from "%/basic-starter/package.json";

import { mergePackageConfigs, omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: mergePackageConfigs(omitBasePackages(packageJson), {
    dependencies: {
      "@picocss/pico": "^2.1.0",
    },
  }),
  formDefaults: { theme: "basic" },
  files: {
    "src/routes/+layout.svelte": `<script lang="ts">
  import type { Snippet } from 'svelte';

  import '@picocss/pico/css/pico.css';
  import '@sjsf/basic-theme/css/pico.css';

  const { children }: { children: Snippet } = $props()
</script>

{@render children()}

<style>
  :global(html) {
    padding: 2rem;
  }
</style>
`,
  },
} satisfies Layer;
