<script lang="ts">
  import { SimpleForm, type Schema, type UiSchema } from "@sjsf/form";
  import { createValidator } from "@sjsf/ajv8-validator";
  import { withZod } from "@sjsf/zod-validator/augmentation";
  import { zodToJsonSchema } from "zod-to-json-schema";
  import { z } from "zod";

  import { useCustomForm } from "@/components/custom-form";

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

  const uiSchema: UiSchema = {
    id: {
      "ui:options": {
        title: "Identifier",
      },
    },
    active: {
      "ui:options": {
        title: "Active",
      },
    },
    multipleChoicesList: {
      "ui:options": {
        title: "Pick max two items",
      },
    },
  };

  const validator = withZod(createValidator(), { schema, uiSchema });

  let value = $state<Value>();

  const form = useCustomForm({
    schema: zodToJsonSchema(schema) as Schema,
    uiSchema,
    validator,
    initialValue: {
      id: "Invalid",
      skills: ["karate", "budo", "aikido"],
      multipleChoicesList: ["foo", "bar", "fuzz"],
    },
    onSubmit(data: Value) {
      value = data;
    },
  });
</script>

<SimpleForm
  {form}
  novalidate
  style="display: flex; flex-direction: column; gap: 1rem;"
/>

<pre>{JSON.stringify(value, null, 2)}</pre>
