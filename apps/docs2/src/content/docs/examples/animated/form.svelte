<script lang="ts">
  import { overrideByRecord } from "@sjsf/form/lib/resolver";
  import type { Schema } from "@sjsf/form";

  import MyForm from "@/components/my-form.svelte";
  import { theme } from "@/components/form-defaults";

  import AnimatedArray from "./animated-array.svelte";

  const schema = {
    type: "array",
    title: "Array",
    minItems: 4,
    default: ["carp", "trout", "bream"],
    items: {
      type: "string",
      default: "default",
    },
  } satisfies Schema;
</script>

<MyForm
  {schema}
  theme={overrideByRecord(theme, {
    arrayField: AnimatedArray,
  })}
/>
