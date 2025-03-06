<script lang="ts">
  import { BasicForm } from "@sjsf/form";
  import { theme } from "@sjsf/daisyui5-theme";
  import "@sjsf/daisyui5-theme/extra-widgets/switch-include";
  import "@sjsf/daisyui5-theme/extra-widgets/filter-radio-buttons-include";
  import "@sjsf/daisyui5-theme/extra-widgets/cally-date-picker-include";

  import { createAstro } from "@/astro.svelte";
  import { createMyForm } from "@/components/my-form";

  import {
    boolean,
    arrayOfUniqueItems,
    schema,
    string,
    uiSchema,
  } from "./_demo-schema";

  const astro = createAstro();

  const form = createMyForm({
    theme,
    schema: {
      ...schema,
      properties: {
        ...schema.properties,
        toggle: boolean,
        filter: arrayOfUniqueItems,
        cally: string,
      },
    },
    uiSchema: {
      ...uiSchema,
      toggle: {
        "ui:components": {
          checkboxWidget: "switchWidget",
        },
      },
      filter: {
        selectWidget: "radioButtonsWidget",
      },
      cally: {
        textWidget: "datePickerWidget",
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
