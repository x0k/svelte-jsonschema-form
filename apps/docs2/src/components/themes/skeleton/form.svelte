<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";

  import { createAstro } from "@/astro.svelte";

  import { schema, uiSchema, initialValue } from "../schema";
  import { createMyValidator } from "../validator";
  import { onSubmit } from "../on-submit";

  import * as defaults from "./defaults";

  const validator = createMyValidator(defaults);
  const form = createForm({
    ...defaults,
    validator,
    initialValue,
    schema,
    uiSchema,
    onSubmit,
  });
  const astro = createAstro();
</script>

<BasicForm
  {form}
  class="flex flex-col gap-4 {astro.darkOrLight}"
  style="margin-bottom: 1rem;"
  data-theme="cerberus"
/>

<pre>{JSON.stringify(form.value, null, 2)}</pre>
