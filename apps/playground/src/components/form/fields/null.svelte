<script lang="ts">
  import type { FieldProps } from "./model";

  let { value = $bindable() }: FieldProps<"null"> = $props();

  $effect(() => {
    if (value === undefined) {
      value = null;
    }
  });
</script>
