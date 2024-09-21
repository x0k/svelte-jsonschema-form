<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  let {
    id,
    value = $bindable(),
    required,
    disabled,
    readonly,
    autofocus,
    placeholder,
  }: WidgetProps<"text"> = $props();
</script>

<input type="text" {id} name={id} bind:value {required} {disabled} {readonly} {autofocus} {placeholder} />
