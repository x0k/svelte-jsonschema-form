<script lang="ts" module>
  import type { SchemaArrayValue } from "@/core/index.js";
  import type { FieldCommonProps } from "@/form/index.js";

  declare module "../../form/index.js" {
    interface ComponentProps {
      arrayNativeFilesField: FieldCommonProps<SchemaArrayValue>;
    }
    interface ComponentBindings {
      arrayNativeFilesField: "value";
    }
  }
</script>

<script lang="ts">
  import type { ComponentProps } from "@/form/index.js";

  import { assertFiles } from "../assert.js";
  import NativeFiles from "./native-files.svelte";
  import './native-files.svelte'

  let {
    value = $bindable(),
    ...rest
  }: ComponentProps["arrayNativeFilesField"] = $props();
</script>

<NativeFiles
  {...rest}
  bind:value={
    () => {
      assertFiles(value);
      return value;
    },
    (v) => {
      value = v;
    }
  }
/>
