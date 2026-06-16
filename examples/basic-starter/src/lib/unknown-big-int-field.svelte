<script lang="ts" module>
  import type { FieldCommonProps } from "@sjsf/form";

  declare module "@sjsf/form" {
    interface ComponentProps {
      unknownBigIntField: FieldCommonProps<unknown>;
    }
    interface ComponentBindings {
      unknownBigIntField: "value";
    }
  }
</script>

<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";
  import StringField from "@sjsf/form/fields/string.svelte";

  let { value = $bindable(), ...rest }: ComponentProps["unknownBigIntField"] =
    $props();

  function assertBigInt(v: unknown): asserts v is bigint | undefined {
    if (v !== undefined && typeof v !== "bigint") {
      throw new Error(
        `expected "bigint" or "undefined", but got (${typeof v}: ${JSON.stringify(v)})`
      );
    }
  }
</script>

<StringField
  bind:value={
    () => {
      assertBigInt(value);
      return value?.toString();
    },
    (v) => {
      if (!v) {
        value = undefined;
      } else {
        try {
          value = BigInt(v);
        } catch {
          value = undefined;
        }
      }
    }
  }
  {...rest}
/>
