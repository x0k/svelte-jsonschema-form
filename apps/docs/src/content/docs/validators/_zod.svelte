<script lang="ts">
  import { SimpleForm, type Schema, ON_INPUT } from "@sjsf/form";
  import { createValidator } from "@sjsf/zod-validator";
  import { zodToJsonSchema } from "zod-to-json-schema";
  import { z } from "zod";

  import { useCustomForm } from "@/components/custom-form";

  import { initialValue, uiSchema } from './_shared';

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

  const rootSchema = zodToJsonSchema(schema, { errorMessages: true }) as Schema

  const validator = createValidator({ schema, rootSchema, uiSchema });

  const form = useCustomForm({
    schema: rootSchema,
    uiSchema,
    validator,
    inputsValidationMode: ON_INPUT,
    initialValue: initialValue as Value,
  });
</script>

<SimpleForm
  {form}
  novalidate
  style="display: flex; flex-direction: column; gap: 1rem;"
/>

<pre>{JSON.stringify(form.value, null, 2)}</pre>
