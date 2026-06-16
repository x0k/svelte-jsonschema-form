<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";
  import { adapt } from "@sjsf/valibot-validator";
  import * as v from "valibot";

  import * as defaults from "$lib/sjsf/defaults";
  import unknownBigIntField from "$lib/unknown-big-int-field.svelte";
  import unknownDateField from "$lib/unknown-date-field.svelte";

  const schema = v.pipe(
    v.object({
      birthday: v.date(),
      id: v.bigint(),
    }),
    v.metadata({ title: "Unserializable fields" })
  );

  const form = createForm({
    ...defaults,
    ...adapt(schema),
    uiSchema: {
      birthday: {
        "ui:components": {
          unknownField: unknownDateField,
        },
        "ui:options": {
          text: {
            type: "datetime-local",
          },
        },
      },
      id: {
        "ui:components": {
          unknownField: unknownBigIntField,
        },
      },
    },
    onSubmit: console.log,
  });
</script>

<BasicForm {form} novalidate />
