<script lang="ts">
  import { type Schema, createForm3, SimpleForm } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/form/basic-theme";
  import { createValidator2 } from "@sjsf/ajv8-validator";

  const validator = createValidator2();

  const schema: Schema = {
    type: "string",
    title: "Simple text input",
  };

  const form = createForm3({
    ...theme,
    schema,
    validator,
    translation,
    onSubmit: console.log,
  });
</script>

<SimpleForm {form} style="display: flex; flex-direction: column; gap: 1rem" />
