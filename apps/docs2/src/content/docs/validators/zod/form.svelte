<script lang="ts">
  import { BasicForm, createForm, ON_INPUT, type Schema } from "@sjsf/form";
  import { createFormValidator } from "@sjsf/zod-validator";
  import { zodToJsonSchema } from "zod-to-json-schema";
  import { z } from "zod";

  import * as defaults from "@/components/form-defaults";

  import { initialValue, uiSchema } from "../shared";

  const schema = z.object({
    id: z
      .string()
      .regex(new RegExp("\\d+"), "Must be a number")
      .min(8)
      .optional(),
    active: z.boolean().optional(),
    skills: z.array(z.string().min(5)).min(4).optional(),
    multipleChoicesList: z
      .array(z.enum(["foo", "bar", "fuzz"]))
      .max(2)
      .optional(),
  });

  type Value = z.infer<typeof schema>;

  const validator = createFormValidator(schema, { uiSchema });

  const form = createForm({
    ...defaults,
    schema: zodToJsonSchema(schema, { errorMessages: true }) as Schema,
    uiSchema,
    validator,
    fieldsValidationMode: ON_INPUT,
    initialValue: initialValue as Value,
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(form.value, null, 2)}</pre>
