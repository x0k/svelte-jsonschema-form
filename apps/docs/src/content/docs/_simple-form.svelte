<script lang="ts">
  import Ajv from "ajv";
  import { Form } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/form/basic-theme";
  import {
    AjvValidator,
    addFormComponents,
    DEFAULT_AJV_CONFIG,
  } from "@sjsf/ajv8-validator";

  const validator = new AjvValidator(
    addFormComponents(new Ajv(DEFAULT_AJV_CONFIG))
  );

  let value = $state();
</script>

<Form
  bind:value
  {...theme}
  schema={{
    title: "Tasks",
    type: "array",
    items: {
      type: "object",
      properties: {
        name: {
          type: "string",
          title: "Name",
        },
        description: {
          type: "string",
          title: "Description",
        },
      },
      required: ["name"],
    },
  }}
  {validator}
  {translation}
>
  <pre><code>{JSON.stringify(value, null, 2)}</code></pre>
</Form>
