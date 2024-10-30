<script lang="ts">
  import Ajv from "ajv";
  import { type Schema, useForm, SimpleForm } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/form/basic-theme";
  import {
    AjvValidator,
    addFormComponents,
    DEFAULT_AJV_CONFIG,
  } from "@sjsf/ajv8-validator";

  const validator = new AjvValidator(
    addFormComponents(new Ajv(DEFAULT_AJV_CONFIG))
  );

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
