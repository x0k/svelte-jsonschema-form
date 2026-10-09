<script lang="ts">
  import {
    BasicForm,
    createForm,
    setFormContext,
    type FormOptions,
  } from "@sjsf/form";
  import type { HTMLFormAttributes } from "svelte/elements";

  const props: FormOptions<any> & {
    formAttributes?: HTMLFormAttributes;
  } = $props();

  // svelte-ignore state_referenced_locally
  const { formAttributes, ...formOptions } = props;

  const form = createForm(formOptions);

  setFormContext(form);
</script>

<BasicForm {form} {...formAttributes} />
