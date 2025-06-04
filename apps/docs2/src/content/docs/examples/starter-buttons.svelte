<script lang="ts">
  import { identity } from "@sjsf/form/lib/function";

  import { ACTUAL_THEMES } from "@/shared";
  import { openThemeStarter } from "@/stackblitz";

  import Buttons from "./buttons.svelte";
</script>

<Buttons items={ACTUAL_THEMES} onClick={openThemeStarter} label={identity} />
