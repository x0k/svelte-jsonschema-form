<script lang="ts">
  import type { FormComponentProps } from "@/form/index.js";

  let {
    children,
    form = $bindable(),
    onsubmit,
    attributes,
  }: FormComponentProps = $props();
</script>

<form
  {onsubmit}
  style="display: flex; flex-direction: column; gap: 1rem"
  {...attributes}
  bind:this={form}
>
  {@render children()}
</form>
