<script lang="ts" module>
  import type { SchemaArrayValue } from "@/core/index.js";
  import type { FieldCommonProps } from "@/form/index.js";

  declare module "../../form/index.js" {
    interface ComponentProps {
      arrayTagsField: FieldCommonProps<SchemaArrayValue>;
    }
    interface ComponentBindings {
      arrayTagsField: "value";
    }
  }
</script>

<script lang="ts">
  import type { ComponentProps } from "@/form/index.js";

  import { assertStrings } from "../assert.js";
  import Tags from './tags.svelte';

  let { value = $bindable(), ...rest }: ComponentProps["arrayTagsField"] =
    $props();
</script>

<Tags
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

