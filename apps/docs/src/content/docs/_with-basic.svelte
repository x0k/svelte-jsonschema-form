<script lang="ts">
  import { Form } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/form/basic-theme";

  import { schema, uiSchema, initialData } from "./_schema";
  import { validator } from "./_validator";

  let value = $state(initialData);
</script>

<Form
  bind:value
  {...theme}
  {schema}
  {uiSchema}
  {validator}
  {translation}
  onSubmit={console.log}
/>

<pre>{JSON.stringify(value, null, 2)}</pre>
