import { subThemeDependencies } from "../../themes.ts";
import { defineLayer, themeDependencies } from "../layer.ts";

export const layer = defineLayer({
  package: {
    dependencies: [
      ...themeDependencies("basic"),
      ...subThemeDependencies("pico"),
    ],
  },
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
});
