<script lang="ts">
  import { SimpleForm, ON_INPUT } from "@sjsf/form";
  import { createValidator } from "@sjsf/cfworker-validator";

  import { useCustomForm } from "@/components/custom-form";

  import { schema, uiSchema } from './_shared';

  const validator = createValidator();

  const form = useCustomForm({
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
