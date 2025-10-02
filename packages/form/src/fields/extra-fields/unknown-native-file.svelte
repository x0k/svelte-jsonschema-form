<script lang="ts" module>
  import type { FieldCommonProps } from "@/form/index.js";

  declare module "../../form/index.js" {
    interface ComponentProps {
      unknownNativeFileField: FieldCommonProps<unknown>;
    }
    interface ComponentBindings {
      unknownNativeFileField: "value";
    }
  }
</script>

<script lang="ts">
  import type { ComponentProps } from "@/form/index.js";

  import { assertFile } from "./shared/assert.js";
  import NativeFile from "./native-file.svelte";

  let {
    value = $bindable(),
    ...rest
  }: ComponentProps["unknownNativeFileField"] = $props();
</script>

<NativeFile
  bind:value={
    () => {
      assertFile(value);
      return value;
    },
    (v) => {
      value = v;
    }
  }
  {...rest}
/>
