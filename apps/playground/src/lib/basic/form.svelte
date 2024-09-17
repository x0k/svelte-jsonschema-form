<script lang="ts">
  import type { FormComponentProps } from '@/components/form'

  let { children, ...props }: FormComponentProps = $props();

  let form: HTMLFormElement

  export function submitRequest(submitter?: HTMLElement | null) {
    form.requestSubmit(submitter)
  }

  export function reset() {
    form.reset()
  }
</script>

<form bind:this={form} {...props}>
  {@render children()}
</form>
