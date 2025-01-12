<script lang="ts">
  import { createForm3, SimpleForm, type Schema } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/form/basic-theme";
  import { createValidator2 } from "@sjsf/ajv8-validator";

  const validator = createValidator2();

  const schema: Schema = {
    type: "string",
    minLength: 10,
  };

  const form = createForm3({
    ...theme,
    initialValue: "initial",
    schema,
    validator,
    translation,
    onSubmit: console.log,
  });

  $effect(() => {
    form.errors = form.validate();
  });
</script>

<SimpleForm {form} style="display: flex; flex-direction: column; gap: 1rem" />
