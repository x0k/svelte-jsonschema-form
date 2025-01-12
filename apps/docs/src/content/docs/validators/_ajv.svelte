<script lang="ts">
  import { SimpleForm, ON_INPUT } from "@sjsf/form";
  import { createValidator2 } from "@sjsf/ajv8-validator";

  import { createCustomForm } from "@/components/custom-form";

  import { schema, uiSchema } from './_shared';

  const validator = createValidator2({
    uiSchema
  });

  const form = createCustomForm({
    schema,
    uiSchema,
    validator,
    fieldsValidationMode: ON_INPUT,
    initialValue: {
      id: "Invalid",
      skills: ["karate", "budo", "aikido"],
      multipleChoicesList: ["foo", "bar", "fuzz"],
    }
  });
</script>

<SimpleForm
  {form}
  novalidate
  style="display: flex; flex-direction: column; gap: 1rem;"
/>

<pre>{JSON.stringify(form.value, null, 2)}</pre>
