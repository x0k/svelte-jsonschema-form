<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  const { children, ...props }: HTMLAttributes<HTMLButtonElement> = $props();
</script>

<button {...props}>
  {@render children?.()}
</button>
