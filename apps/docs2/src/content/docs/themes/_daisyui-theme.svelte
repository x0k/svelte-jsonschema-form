<script lang="ts">
  import { BasicForm } from "@sjsf/form";
  import { theme } from "@sjsf/daisyui-theme";
  import "@sjsf/daisyui-theme/extra-widgets/switch-include";

  import { createAstro } from "@/astro.svelte";
  import { createMyForm } from "@/components/my-form";

  import { boolean, schema, uiSchema } from "./_demo-schema";

  const astro = createAstro();

  const form = createMyForm({
    theme,
    schema: {
      ...schema,
      properties: {
        ...schema.properties,
        toggle: boolean,
      },
    },
    uiSchema: {
      ...uiSchema,
      toggle: {
        "ui:components": {
          checkboxWidget: "switchWidget",
        },
      },
    },
  });
</script>

<BasicForm
  {form}
  novalidate
  style="background-color: transparent; margin-bottom: 1rem;"
  data-theme={astro.darkOrLight}
/>

<pre>{JSON.stringify(form.value, null, 2)}</pre>
