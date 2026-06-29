<script lang="ts">
  import { ComponentsAndWidgets } from "theme-testing/demo";

  import "../app.css";
  import * as components from "../lib/components/ui/index.js";
  import { specs } from "../lib/specs.js";
  import { setThemeContext, theme } from "../lib/theme/index.js";

  setThemeContext({ components });

  // eslint-disable-next-line svelte/valid-prop-names-in-kit-pages
  const { showCode = true } = $props();
</script>

<ComponentsAndWidgets {theme} {specs} {showCode} />
