<script lang="ts">
  import { setThemeContext } from "@sjsf/shadcn4-theme";
  import * as components from "@sjsf/shadcn4-theme/new-york";
  import { ComponentsAndWidgets } from "theme-testing/demo";

  import "../app.css";
  import * as extraComponents from "../lib/components/ui/index.js";
  import { specs } from "../lib/specs.js";
  import { theme } from "../lib/theme/index.js";

  setThemeContext({ components: { ...components, ...extraComponents } });
</script>

<ComponentsAndWidgets {theme} {specs} />
