<script lang="ts">
  import { FluentUISvelte } from "fluentui-svelte";
  import type { Snippet } from "svelte";

  // Only the token sheets are imported. `reset.css` and `typography.css` are
  // documented as optional and are deliberately left out: the build ships this
  // route's CSS as the package's `styles.css`, and typography.css carries a bare
  // `*` rule that would then leak into every consumer of the theme.
  import "fluentui-svelte/theme.css";
  import "fluentui-svelte/media-darkmode.css"; /* Or:  import 'fluentui-svelte/class-darkmode.css' */

  const { children }: { children: Snippet } = $props();
</script>

<FluentUISvelte>
  {@render children()}
</FluentUISvelte>
