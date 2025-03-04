<script lang="ts">
  import { RawForm, ON_INPUT } from "@sjsf/form";
  import { createValidator } from "@sjsf/cfworker-validator";

  import { createCustomForm } from "@/components/custom-form";

  import { schema, uiSchema } from "./_shared";

  const validator = createValidator({ uiSchema });

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
