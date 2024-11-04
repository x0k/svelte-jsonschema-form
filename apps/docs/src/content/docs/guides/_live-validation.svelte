<script lang="ts">
  import { useForm, SimpleForm, type Schema } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/form/basic-theme";
  import { createValidator } from "@sjsf/ajv8-validator";

  const validator = createValidator();

  const schema: Schema = {
    type: "string",
    minLength: 10,
  };

  const form = useForm({
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
