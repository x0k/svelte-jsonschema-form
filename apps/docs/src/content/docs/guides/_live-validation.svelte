<script lang="ts">
  import { SvelteMap } from "svelte/reactivity";
  import Ajv from "ajv";
  import { Form, type Errors, type Schema } from "@sjsf/form";
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
    minLength: 7,
  };

  let form: Form<any, any>;
  let value = $state("initial");
  let errors: Errors = $state.raw(new SvelteMap());
  $effect(() => {
    value;
    errors = form.validate();
  });
</script>

<Form
  bind:this={form}
  bind:value
  bind:errors
  {...theme}
  {schema}
  {validator}
  {translation}
  onSubmit={console.log}
/>
