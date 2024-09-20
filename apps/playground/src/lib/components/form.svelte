<script lang="ts">
  import type { FormComponentProps } from '@/components/form'

  let { children, form = $bindable(), ...props }: FormComponentProps = $props();
</script>

<form bind:this={form} {...props}>
  {@render children?.()}
</form>
