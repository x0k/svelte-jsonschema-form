<script lang="ts" generics="T">
  import type { HTMLTextareaAttributes } from "svelte/elements";

  let {
    value = $bindable(),
    ...rest
  }: { value: T } & Omit<HTMLTextareaAttributes, "value"> = $props();

  let error = $state(false);

  let writable = $derived(JSON.stringify(value, null, 2));
</script>

<textarea
  {...rest}
  data-error={error}
  bind:value={
    () => writable,
    (str) => {
      writable = str;
      try {
        value = JSON.parse(str);
        error = false;
      } catch (e) {
        error = true;
      }
    }
  }
></textarea>
