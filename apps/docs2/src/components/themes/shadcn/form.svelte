<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  import { setThemeContext } from "@sjsf/shadcn4-theme";
  import * as components from "@sjsf/shadcn4-theme/new-york";

  import { createAstro } from "@/astro.svelte";

  import { schema, uiSchema, initialValue } from "../schema";
  import { createMyValidator } from "../validator";
  import { onSubmit } from "../on-submit";

  import * as defaults from './defaults'

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

  setThemeContext({ components });
</script>

<BasicForm {form} class="flex flex-col gap-4 {astro.darkOrLight}" />

<pre style="padding-top: 1rem;">{JSON.stringify(form.value, null, 2)}</pre>
