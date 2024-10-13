<script lang="ts" generics="T">
  import { SvelteMap } from "svelte/reactivity";
  import Ajv, { type ErrorObject } from "ajv";
  import { Form, type FormProps } from "@sjsf/form";
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

  type DefinedProps = "widgets" | "components" | "validator" | "translation";
  type Props = Omit<FormProps<T, ErrorObject>, DefinedProps> &
    Partial<Pick<FormProps<T, ErrorObject>, DefinedProps>>;

  let {
    value = $bindable(),
    form = $bindable(),
    isSubmitted = $bindable(false),
    errors = $bindable(new SvelteMap()),
    ...rest
  }: Props = $props();
</script>

<Form
  {...theme}
  {validator}
  {translation}
  {...rest}
  bind:value
  bind:form
  bind:isSubmitted
  bind:errors
/>
