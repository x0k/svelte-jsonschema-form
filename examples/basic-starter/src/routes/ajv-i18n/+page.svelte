<script lang="ts">
  import {
    createFormValidator,
    DEFAULT_AJV_CONFIG,
    addFormComponents,
  } from "@sjsf/ajv8-validator";
  import { createForm, BasicForm, type Schema } from "@sjsf/form";
  import addFormats from "ajv-formats";
  import localize from "ajv-i18n/localize/ru";

  import * as defaults from "$lib/sjsf/defaults";

  const schema = {
    type: "object",
    title: "User form",
    properties: {
      name: { title: "Name", type: "string", minLength: 1 },
      email: { title: "Email", type: "string", format: "email" },
      age: { title: "Age", type: "integer", minimum: 18, maximum: 35 },
    },
    required: ["name", "email", "age"],
  } as const satisfies Schema;

  const form = createForm({
    ...defaults,
    validator: createFormValidator({
      ajvOptions: { ...DEFAULT_AJV_CONFIG, messages: false },
      ajvPlugins: (ajv) => addFormats(addFormComponents(ajv)),
      localize: (errors) => {
        localize(errors);
        return errors;
      },
    }),
    schema,
    onSubmit: console.log,
  });
</script>

<BasicForm {form} novalidate />
