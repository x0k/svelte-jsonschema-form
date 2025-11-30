<script lang="ts" module>
  import type { SchemaObjectValue } from "@/core/schema.js";
  import type { FieldCommonProps } from "@/form/fields.js";

  declare module "../../form/index.js" {
    interface ComponentProps {
      objectRangeField: FieldCommonProps<SchemaObjectValue>;
    }
    interface ComponentBindings {
      objectRangeField: "value";
    }
  }
</script>

<script lang="ts">
  import type { ComponentProps } from "@/form/index.js";

  import { assertRange } from "../assert.js";
  import RangeComponent from "./range.svelte";

  let { value = $bindable(), ...rest }: ComponentProps["objectRangeField"] =
    $props();
</script>

<RangeComponent
  {...rest}
  bind:value={
    () => {
      assertRange(value);
      return value;
    },
    (v) => {
      value = v;
    }
  }
/>
