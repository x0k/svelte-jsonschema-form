<script lang="ts">
  import { overrideByRecord } from "@sjsf/form/lib/resolver";
  import { createForm, BasicForm, type Schema } from "@sjsf/form";

  import * as defaults from "$lib/form-defaults";

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
  } as const satisfies Schema;

  const theme = overrideByRecord(defaults.theme, {
    arrayField: AnimatedArray,
  });

  const form = createForm({
    ...defaults,
    theme,
    schema,
    onSubmit: console.log,
  });
</script>

<BasicForm {form} />
