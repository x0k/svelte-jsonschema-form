<script lang="ts">
  import { BasicForm } from "@sjsf/form";
  import { theme } from "@sjsf/basic-theme";
  import { specs } from '@sjsf/basic-theme/specs';

  import { createMyForm } from "@/components/my-form";

  import { createSchemas } from "./_demo-schema";

  const form = createMyForm({
    ...createSchemas(specs),
    theme,
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(form.value, null, 2)}</pre>
