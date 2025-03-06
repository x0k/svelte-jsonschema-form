<script lang="ts">
  import { BasicForm } from "@sjsf/form";
  import { theme } from "@sjsf/basic-theme";

  import { createMyForm } from "@/components/my-form";

  import { schema, uiSchema } from "./_demo-schema";

  const form = createMyForm({
    theme,
    schema,
    uiSchema,
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(form.value, null, 2)}</pre>
