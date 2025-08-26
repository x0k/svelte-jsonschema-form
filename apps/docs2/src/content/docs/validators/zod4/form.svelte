<script lang="ts">
  import {
    BasicForm,
    createForm,
    ON_ARRAY_CHANGE,
    ON_CHANGE,
    ON_INPUT,
  } from "@sjsf/form";
  import { setupFormValidator } from "@sjsf/zod4-validator/classic";
  import { z } from "zod/v4";
  import en from "zod/v4/locales/en.js"

  import * as defaults from "@/lib/form/defaults";

  import { initialValue, uiSchema } from "../shared";

  z.config(en())

  const zodSchema = z.object({
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

  const { schema, validator } = setupFormValidator(zodSchema, { uiSchema });

  const form = createForm({
    ...defaults,
    schema,
    uiSchema,
    createValidator: () => validator,
    fieldsValidationMode: ON_INPUT | ON_CHANGE | ON_ARRAY_CHANGE,
    initialValue: initialValue,
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(form.value, null, 2)}</pre>
