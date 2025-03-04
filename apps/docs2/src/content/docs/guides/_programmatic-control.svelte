<script lang="ts">
  import {
    Content,
    FormElement,
    setFromContext,
    type Schema,
  } from "@sjsf/form";

  import { createCustomForm } from "@/components/custom-form";

  const schema: Schema = {
    type: "string",
    minLength: 10,
  };

  const form = createCustomForm({
    schema,
    initialValue: "initial",
    onSubmit: (v) => window.alert(v),
  });
  setFromContext(form.context);

  let ref: HTMLFormElement | undefined = $state();
</script>

<FormElement bind:ref {form}>
  <Content {form} />
</FormElement>
<button
  onclick={(_e) => {
    ref?.requestSubmit();
    // or
    // form.submit(new SubmitEvent("submit", { submitter: _e.currentTarget }));
    // (note that the `target` and `currentTarget` will not be properly set)
  }}>My submit</button
>
<button
  onclick={() => {
    ref?.reset();
    // or
    // form.reset();
    // (note that `onReset` handler will not be called)
  }}
>
  My reset
</button>
