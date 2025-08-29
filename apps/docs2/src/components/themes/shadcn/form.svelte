<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  import { setThemeContext } from "@sjsf/shadcn4-theme";
  import * as components from "@sjsf/shadcn4-theme/new-york";

  import { createAstro } from "@/astro.svelte";

  import { schema, uiSchema, initialValue } from "../data";
  import * as defaults from "./defaults";

  const form = createForm({
    ...defaults,
    initialValue,
    schema,
    uiSchema,
    onSubmit: ({ name }) => window.alert(`Hello, ${name}`),
  });
  const astro = createAstro();

  setThemeContext({ components });
</script>

<BasicForm {form} class="flex flex-col gap-4 {astro.darkOrLight}" />

<pre style="padding-top: 1rem;">{JSON.stringify(form.value, null, 2)}</pre>
