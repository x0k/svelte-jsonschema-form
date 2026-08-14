<script lang="ts">
  import { ConfigProvider } from "stdf";
  import { ComponentsAndWidgets } from "theme-testing/demo";

  import "../app.css";
  import { theme } from "../lib/index.js";
  import { specs } from "../lib/specs.js";

  // eslint-disable-next-line svelte/valid-prop-names-in-kit-pages
  const { showCode = true } = $props();
</script>

<ConfigProvider>
  <ComponentsAndWidgets {theme} {specs} {showCode} />
</ConfigProvider>
