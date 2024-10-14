<script lang="ts">
  import { theme } from "@sjsf/form/basic-theme";

  import CustomForm from "@/components/custom-form.svelte";

  import { schema, uiSchema } from "./_demo-schema";

  let value = $state();
</script>

<CustomForm
  {...theme}
  bind:value
  {schema}
  {uiSchema}
  novalidate
  onSubmit={console.log}
/>

<pre style="margin-top: 1rem">{JSON.stringify(value, null, 2)}</pre>
