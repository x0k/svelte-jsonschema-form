<script lang="ts">
  import { BasicForm, ON_INPUT } from "@sjsf/form";
  import { createValidator } from "@sjsf/cfworker-validator";

  import { createMyForm } from "@/components/my-form";

  import { schema, uiSchema } from "./_shared";

  const validator = createValidator({ uiSchema });

  const form = createMyForm({
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

<BasicForm {form} novalidate />

<pre>{JSON.stringify(form.value, null, 2)}</pre>
