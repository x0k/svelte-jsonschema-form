<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { theme } from "@sjsf/basic-theme";
  import { specs } from '@sjsf/basic-theme/specs';

  import * as defaults from "@/lib/form/defaults";

  import { createSchemas } from "../_demo-schema";

  const form = createForm({
    ...defaults,
    ...createSchemas(specs),
    theme,
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
