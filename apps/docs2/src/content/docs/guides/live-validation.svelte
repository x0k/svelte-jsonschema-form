<script lang="ts">
  import { createForm, BasicForm, type Schema, groupErrors } from "@sjsf/form";
  import { resolver } from "@sjsf/form/resolvers/basic";
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
    resolver,
    validator,
    translation,
    onSubmit: console.log,
  });

  $effect(() => {
    form.errors = groupErrors(validator.validateFormValue(schema, form.value));
  });
</script>

<BasicForm {form} />
