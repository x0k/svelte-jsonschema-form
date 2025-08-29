<script lang="ts">
  import { createForm, BasicForm, type Schema, groupErrors } from "@sjsf/form";
  import { resolver } from "@sjsf/form/resolvers/basic";
  import { translation } from "@sjsf/form/translations/en";
  import { createFormMerger } from "@sjsf/form/mergers/modern";
  import { createFormValidator } from "@sjsf/ajv8-validator";
  import { theme } from "@sjsf/basic-theme";

  const schema: Schema = {
    type: "string",
    minLength: 10,
  };

  const validator = createFormValidator();

  const form = createForm({
    theme,
    initialValue: "initial",
    schema,
    resolver,
    translation,
    onSubmit: console.log,
    createValidator: () => validator,
    createMerger: createFormMerger,
  });

  $effect(() => {
    form.errors = groupErrors(validator.validateFormValue(schema, form.value));
  });
</script>

<BasicForm {form} />
