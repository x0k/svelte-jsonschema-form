<script lang="ts">
  import { ON_INPUT, BasicForm } from "@sjsf/form";
  import { createFormValidator } from "@sjsf/ajv8-validator";

  import { createMyForm } from "@/components/my-form";

  import { schema, uiSchema } from "./_shared";

  const validator = createFormValidator({
    uiSchema,
  });

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
