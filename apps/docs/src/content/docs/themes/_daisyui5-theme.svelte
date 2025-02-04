<script lang="ts">
  import { RawForm } from "@sjsf/form";
  import { theme } from "@sjsf/daisyui5-theme";

  import { useAstro } from "@/astro.svelte";
  import { createCustomForm } from "@/components/custom-form";

  import { boolean, arrayOfUniqueItems, schema, string, uiSchema } from "./_demo-schema";
  
  const astro = useAstro();

  const form = createCustomForm({
    ...theme,
    schema: {
      ...schema,
      properties: {
        ...schema.properties,
        toggle: boolean,
        filter: arrayOfUniqueItems,
        cally: string,
        pikaday: string,
      },
    },
    uiSchema: {
      ...uiSchema,
      toggle: {
        "ui:widget": "toggle",
      },
      filter: {
        "ui:widget": "filter",
      },
      cally: {
        "ui:widget": "callyCalendar",
      },
      pikaday: {
        'ui:widget': "pikadayCalendar"
      }
    },
  });
</script>

<RawForm
  {form}
  novalidate
  style="background-color: transparent; margin-bottom: 1rem;"
  data-theme={astro.darkOrLight}
/>

<pre>{JSON.stringify(form.value, null, 2)}</pre>
