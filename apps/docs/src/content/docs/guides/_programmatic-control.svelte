<script lang="ts">
  import { FormContent, type Schema } from "@sjsf/form";

  import { useCustomForm } from "@/components/custom-form";

  const schema: Schema = {
    type: "string",
    minLength: 10,
  };

  const form = useCustomForm({
    schema,
    initialValue: "initial",
    onSubmit: (v) => window.alert(v),
  });

  let formElement: HTMLFormElement;
</script>

<form bind:this={formElement} use:form.enhance>
  <FormContent bind:value={form.formValue} />
</form>
<button
  onclick={(e) => {
    formElement?.requestSubmit();
    // or (note that the `target` and `currentTarget` will not be properly set)
    // form.submit(new SubmitEvent("submit", { submitter: e.currentTarget }));
  }}>My submit</button
>
<button
  onclick={() => {
    formElement?.reset();
    // or (not that `onReset` handler will not be called)
    // form.reset();
  }}
>
  My reset
</button>
