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

  type Defaults = "widgets" | "components" | "validator" | "translation";

  type Props<T> = Omit<FormProps<T, ErrorObject>, Defaults> &
    Partial<Pick<FormProps<T, ErrorObject>, Defaults>>;

  let {
    value = $bindable(),
    form = $bindable(),
    isSubmitted = $bindable(false),
    errors = $bindable(new SvelteMap()),
    validator = new AjvValidator(
      addFormComponents(new Ajv(DEFAULT_AJV_CONFIG))
    ),
    ...rest
  }: Props<T> = $props();

  let self: Form<T, ErrorObject>;

  export function validate() {
    return self.validate();
  }
</script>

<Form
  bind:this={self}
  {translation}
  {...theme}
  {...rest}
  {validator}
  bind:value
  bind:form
  bind:isSubmitted
  bind:errors
/>
