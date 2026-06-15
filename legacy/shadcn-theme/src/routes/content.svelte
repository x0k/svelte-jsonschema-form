<script lang="ts">
  import { ComponentsAndWidgets } from "theme-testing/demo";

  import { specs } from "../lib/specs";
  import {
    theme,
    setThemeContext,
    type ThemeComponents,
  } from "../lib/theme/index.js";

  const { components }: { components: ThemeComponents } = $props();

  setThemeContext({ components });
</script>

<ComponentsAndWidgets {theme} {specs} />
