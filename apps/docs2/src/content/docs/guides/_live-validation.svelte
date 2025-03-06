<script lang="ts">
  import { createForm, BasicForm, type Schema } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/basic-theme";
  import { createFormValidator } from "@sjsf/ajv8-validator";

  const validator = createFormValidator();

  const schema: Schema = {
    type: "string",
    minLength: 10,
  };

  const form = createForm({
    theme,
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

<BasicForm {form} />
