<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  let { value = $bindable(), ...rest }: WidgetProps<"text"> = $props();
</script>

<input {...rest} type="text" bind:value name={rest.id} />
