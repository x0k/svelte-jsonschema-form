<script lang="ts">
  import { type Schema, useForm, SimpleForm } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/form/basic-theme";
  import { createValidator } from "@sjsf/ajv8-validator";

  const validator = createValidator();

  const schema: Schema = {
    type: "string",
    title: "Simple text input",
  };

  const form = useForm({
    ...theme,
    schema,
    validator,
    translation,
    onSubmit: console.log,
  });
</script>

<SimpleForm {form} style="display: flex; flex-direction: column; gap: 1rem" />
