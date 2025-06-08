<script lang="ts">
  import type { HTMLFormAttributes } from "svelte/elements";

  import type { FormState } from "./create-form.svelte.js";
  import { setFormContext } from "./context/context.js";
  import Form from "./form.svelte";
  import Content from "./content.svelte";
  import SubmitButton from "./submit-button.svelte";

  let {
    ref = $bindable(),
    form,
    ...attributes
  }: {
    form: Pick<FormState<any, any>, "context">;
    ref?: HTMLFormElement | undefined;
  } & HTMLFormAttributes = $props();

  setFormContext(form.context);
</script>

<Form bind:ref {attributes}>
  <Content />
  <SubmitButton />
</Form>
