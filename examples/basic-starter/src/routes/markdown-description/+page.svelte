<script lang="ts">
  import { createForm, BasicForm, type Schema } from "@sjsf/form";
  import { overrideByRecord } from "@sjsf/form/lib/resolver";

  import * as defaults from "$lib/sjsf/defaults";

  import Description from "./description.svelte";

  const schema = {
    type: "null",
    title: "Title",
    description: "**bold** *italic* [link](#)",
  } as const satisfies Schema;

  const theme = overrideByRecord(defaults.theme, {
    description: Description,
  });

  const form = createForm({
    ...defaults,
    theme,
    schema,
    onSubmit: console.log,
  });
</script>

<BasicForm {form} />
