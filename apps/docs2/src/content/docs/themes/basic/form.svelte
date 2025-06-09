<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  import { theme } from "@sjsf/basic-theme";
  import { specs } from '@sjsf/basic-theme/specs';

  import * as defaults from "@/components/form-defaults";

  import { createSchemas } from "../_demo-schema";

  const form = createForm({
    ...defaults,
    ...createSchemas(specs),
    theme,
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(form.value, null, 2)}</pre>
