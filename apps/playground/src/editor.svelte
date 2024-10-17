<script lang="ts" generics="T">
  import type { HTMLTextareaAttributes } from "svelte/elements";
  import { proxy } from "@sjsf/form/lib/svelte.svelte";

  let {
    value = $bindable(),
    ...rest
  }: { value: T } & Omit<HTMLTextareaAttributes, "value"> = $props();

  let error = $state(false);

  const mapped = proxy(
    () => JSON.stringify(value, null, 2),
    (str) => {
      try {
        value = JSON.parse(str);
        error = false;
      } catch (e) {
        error = true;
      }
    }
  );
</script>

<textarea {...rest} data-error={error} bind:value={mapped.value}></textarea>
