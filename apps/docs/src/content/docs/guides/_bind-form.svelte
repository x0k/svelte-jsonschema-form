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
<button onclick={() => formElement?.requestSubmit()}>My submit</button>
<button onclick={() => formElement?.reset()}> My reset </button>
