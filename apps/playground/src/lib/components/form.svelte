<script lang="ts">
  import type { FormComponentProps } from '@/components/form'

  let { children, form = $bindable(), onsubmit }: FormComponentProps = $props();
</script>

<form bind:this={form} {onsubmit} style="display: flex; flex-direction: column; gap: 1rem" >
  {@render children?.()}
</form>
