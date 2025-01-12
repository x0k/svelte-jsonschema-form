<script lang="ts">
  import { FormContent, setFromContext, type Schema } from "@sjsf/form";

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
  setFromContext(form.context)

  let formElement: HTMLFormElement;
</script>

<form bind:this={formElement} use:form.enhance>
  <FormContent bind:value={form.formValue} />
</form>
<button
  onclick={(_e) => {
    formElement?.requestSubmit();
    // or
    // form.submit(new SubmitEvent("submit", { submitter: _e.currentTarget }));
    // (note that the `target` and `currentTarget` will not be properly set)
  }}>My submit</button
>
<button
  onclick={() => {
    formElement?.reset();
    // or
    // form.reset();
    // (note that `onReset` handler will not be called)
  }}
>
  My reset
</button>
