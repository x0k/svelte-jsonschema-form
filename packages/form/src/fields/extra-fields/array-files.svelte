<script lang="ts" module>
  import type { SchemaArrayValue } from "@/core/index.js";
  import type { FieldCommonProps } from "@/form/index.js";

  declare module "../../form/index.js" {
    interface ComponentProps {
      arrayFilesField: FieldCommonProps<SchemaArrayValue>;
    }
    interface ComponentBindings {
      arrayFilesField: "value";
    }
  }
</script>

<script lang="ts">
  import type { ComponentProps } from "@/form/index.js";

  import { assertStrings } from "./shared/assert.js";
  import Files from "./files.svelte";

  let { value = $bindable(), ...rest }: ComponentProps["arrayFilesField"] =
    $props();
</script>

<Files
  {...rest}
  bind:value={
    () => {
      assertStrings(value);
      return value;
    },
    (v) => {
      value = v;
    }
  }
/>
