<script lang="ts">
  import { RawForm } from "@sjsf/form";
  import { theme } from "@sjsf/form/basic-theme";

  import { createCustomForm } from "@/components/custom-form";

  import { schema, uiSchema } from "./_demo-schema";

  const form = createCustomForm({
    ...theme,
    schema,
    uiSchema,
  });
</script>

<RawForm {form} novalidate />

<pre>{JSON.stringify(form.value, null, 2)}</pre>
