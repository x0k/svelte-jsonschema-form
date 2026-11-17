<script lang="ts" module>
  import type { FieldCommonProps } from "#form/index.js";

  declare module "../../form/index.js" {
    interface ComponentProps {
      unknownNativeDateField: FieldCommonProps<unknown>;
    }
    interface ComponentBindings {
      unknownNativeDateField: "value";
    }
  }
</script>

<script lang="ts">
  import type { ComponentProps } from "#form/index.js";

  import { assertDate } from "../assert.js";
  import NativeDate from "./native-date.svelte";
  import "./native-date.svelte";

  let {
    value = $bindable(),
    ...rest
  }: ComponentProps["unknownNativeDateField"] = $props();
</script>

<NativeDate
  bind:value={
    () => {
      assertDate(value);
      return value;
    },
    (v) => {
      value = v;
    }
  }
  {...rest}
/>
