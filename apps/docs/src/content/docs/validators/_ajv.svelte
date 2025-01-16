<script lang="ts">
  import { ON_INPUT, RawForm } from "@sjsf/form";
  import { createValidator2 } from "@sjsf/ajv8-validator";

  import { createCustomForm } from "@/components/custom-form";

  import { schema, uiSchema } from "./_shared";

  const validator = createValidator2({
    uiSchema,
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
    },
  });
</script>

<RawForm {form} novalidate />

<pre>{JSON.stringify(form.value, null, 2)}</pre>
