<script lang="ts">
  import type { Schema } from "@sjsf/form";

  import CustomForm from "@/components/custom-form.svelte";

  const schema: Schema = {
    type: "string",
  };

  let form = $state<HTMLFormElement>();
</script>

<CustomForm bind:form {schema} novalidate onSubmit={(v) => window.alert(v)}>
  {null}
</CustomForm>

<button
  onclick={() => {
    form?.requestSubmit();
  }}>My submit</button
>

<button onclick={() => {
  form?.reset();
}} >
  My reset
</button>
