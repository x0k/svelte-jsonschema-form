<script lang="ts">
  import { SvelteMap } from "svelte/reactivity";
  import Ajv from "ajv";
  import { useForm, SimpleForm, type Errors, type Schema } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/form/basic-theme";
  import {
    AjvValidator,
    addFormComponents,
    DEFAULT_AJV_CONFIG,
  } from "@sjsf/ajv8-validator";
  import { untrack } from "svelte";

  const validator = new AjvValidator(
    addFormComponents(new Ajv(DEFAULT_AJV_CONFIG))
  );

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
