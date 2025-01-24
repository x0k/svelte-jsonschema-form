<script lang="ts">
  import type { FormComponentProps } from '@sjsf/form'

  let { children, form = $bindable(), onsubmit, attributes }: FormComponentProps = $props();
</script>

<form class="flex flex-col gap-4" {onsubmit} {...attributes} bind:this={form} >
  {@render children?.()}
</form>
