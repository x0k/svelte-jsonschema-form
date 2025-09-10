<script lang="ts">
  import {
    BasicForm,
    createForm,
    ON_ARRAY_CHANGE,
    ON_CHANGE,
    ON_INPUT,
  } from "@sjsf/form";
  import { adapt } from "@sjsf/zod4-validator/classic";
  import { z } from "zod";
  import { en } from "zod/locales";

  import * as defaults from "@/lib/form/defaults";

  import { initialValue, uiSchema } from "../shared";

  z.config(en());

  const schema = z.object({
    id: z
      .string()
      .regex(new RegExp("^\\d+$"), "Must be a number")
      .min(8)
      .optional(),
    active: z.boolean(),
    skills: z.array(z.string().min(5)).min(4).optional(),
    multipleChoicesList: z
      .array(z.enum(["foo", "bar", "fuzz"]))
      .max(2)
      .optional(),
  });

  const form = createForm({
    ...defaults,
    ...adapt(schema),
    uiSchema,
    fieldsValidationMode: ON_INPUT | ON_CHANGE | ON_ARRAY_CHANGE,
    initialValue: initialValue,
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(form.value, null, 2)}</pre>
