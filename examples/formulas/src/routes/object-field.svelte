<script lang="ts" module>
  import type { SchemaObjectValue } from "@sjsf/form/core";

  declare module "@sjsf/form" {
    interface UiOptions {
      myObjectEffects?: ((
        value: SchemaObjectValue | undefined
      ) => void | (() => void))[];
    }
  }
</script>

<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";
  import Field from "@sjsf/form/fields/object/object-field.svelte";

  let {
    value = $bindable(),
    uiOption,
    ...rest
  }: ComponentProps["objectField"] = $props();

  const effects = $derived(uiOption("myObjectEffects"));

  $effect(() => {
    if (effects === undefined) {
      return;
    }
    for (const fn of effects) {
      $effect(() => fn(value));
    }
  });
</script>

<Field bind:value {uiOption} {...rest} />
