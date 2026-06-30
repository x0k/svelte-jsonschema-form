<script lang="ts">
  import { Willow } from "@svar-ui/svelte-core";
  import { ComponentsAndWidgets } from "theme-testing/demo";

  import { theme } from "../lib/index.js";
  import { specs } from "../lib/specs.js";

  // eslint-disable-next-line svelte/valid-prop-names-in-kit-pages
  const { showCode = true } = $props();
</script>

<Willow>
  <ComponentsAndWidgets {theme} {specs} {showCode} />
</Willow>
