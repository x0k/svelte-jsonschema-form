<script lang="ts">
  import { SimpleForm } from "@sjsf/form";
  import { theme } from "@sjsf/form/basic-theme";

  import { createCustomForm } from "@/components/custom-form";

  import { schema, uiSchema } from "./_demo-schema";
  
  const form = createCustomForm({
    ...theme,
    schema,
    uiSchema,
  });
</script>

<SimpleForm
  {form}
  novalidate
  style="display: flex; flex-direction: column; gap: 1rem;"
/>

<pre>{JSON.stringify(form.value, null, 2)}</pre>
