<script lang="ts">
  import Ajv from "ajv";
  import { Form, type Schema } from "@sjsf/form";
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

  const schema: Schema = {
    type: "object",
    title: "Mini form",
    properties: {
      text: {
        type: "string",
      }
    },
    required: ["text"],
  }
</script>

<Form
  {...theme}
  {schema}
  {validator}
  {translation}
  onsubmit={(e) => e.preventDefault()}
/>
