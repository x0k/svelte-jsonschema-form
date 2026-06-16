<script lang="ts" module>
  import type { FieldCommonProps } from "@sjsf/form";

  declare module "@sjsf/form" {
    interface ComponentProps {
      unknownDateField: FieldCommonProps<unknown>;
    }
    interface ComponentBindings {
      unknownDateField: "value";
    }
  }
</script>

<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";
  import StringField from "@sjsf/form/fields/string.svelte";

  let { value = $bindable(), ...rest }: ComponentProps["unknownDateField"] =
    $props();

  function assertDate(v: unknown): asserts v is Date | undefined {
    if (v !== undefined && !(v instanceof Date)) {
      throw new Error(
        `expected "Date" or "undefined", but got (${typeof v}: ${JSON.stringify(v)})`
      );
    }
  }
</script>

<StringField
  bind:value={
    () => {
      assertDate(value);
      return value?.toISOString().slice(0, 16);
    },
    (v) => {
      value = v ? new Date(v) : undefined;
    }
  }
  {...rest}
/>
