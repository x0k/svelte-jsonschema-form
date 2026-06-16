<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";
  import { adapt } from "@sjsf/zod4-validator/classic";
  import * as z from "zod";

  import * as defaults from "$lib/sjsf/defaults";
  import unknownBigIntField from "$lib/unknown-big-int-field.svelte";
  import unknownDateField from "$lib/unknown-date-field.svelte";

  const schema = z
    .object({
      birthday: z.date().meta({ title: "Birthday" }),
      id: z.bigint().meta({ title: "ID" }),
    })
    .meta({ title: "Unserializable fields" });

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
