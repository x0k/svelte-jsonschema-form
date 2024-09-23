<script lang="ts">
  import type { FieldProps } from "./model";

  const { value, onChange }: FieldProps<"null"> = $props();

  $effect(() => {
    if (value === undefined) {
      onChange(null);
    }
  });
</script>
