<script lang="ts">
  import { setThemeContext } from "@sjsf/shadcn4-theme";
  import * as components from "@sjsf/shadcn4-theme/new-york";

  import "../app.css";

  const { children } = $props();

  setThemeContext({ components });
</script>

{@render children()}
