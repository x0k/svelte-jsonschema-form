<script lang="ts">
  import { setThemeContext } from "@sjsf/shadcn4-theme";
  import * as components from "@sjsf/shadcn4-theme/new-york";
  import * as extraComponents from '@sjsf-lab/shadcn-extras-theme/ui';

  import "../app.css";

  const { children } = $props();

  setThemeContext({ components: { ...components, ...extraComponents } });
</script>

{@render children()}
