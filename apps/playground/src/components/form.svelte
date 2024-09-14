<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from "svelte/elements";
  import type { JSONSchema7 } from "json-schema";

  let form: HTMLFormElement;

  export function submit() {
    form.requestSubmit();
  }

  export function reset() {
    form.reset();
  }

  interface Props extends HTMLAttributes<HTMLFormElement> {
    schema: JSONSchema7;
    children?: Snippet
    value?: any;
  }

  const { schema, value, children, ...formProps }: Props = $props();

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
  }
</script>

<form {...formProps} onsubmit={handleSubmit} bind:this={form}>
  {#if children}
    {@render children()}
  {:else}
    <button type="submit">Submit</button>
  {/if}
</form>
