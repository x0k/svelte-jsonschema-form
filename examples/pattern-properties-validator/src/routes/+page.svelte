<script lang="ts">
  import {
    createForm,
    BasicForm,
    type Schema,
    type UiSchemaRoot,
  } from "@sjsf/form";
  import { createPatternPropertyKeyValidator } from "@sjsf/form/validators/properties";

  import * as defaults from "$lib/form-defaults";

  const schema = {
    title: "Pattern properties",
    type: "object",
    additionalProperties: false,
    patternProperties: {
      "^[a-z][a-zA-Z0-9_]+$": {
        type: "string",
      },
    },
  } as const satisfies Schema;

  const uiSchema: UiSchemaRoot = {
    "ui:options": {
      translations: {
        "add-object-property": "Add pattern property",
        "additional-property": "patternProperty",
      },
      // NOTE: You can use `additionalPropertyKey` to ensure that each generated key is valid
      additionalPropertyKey: (key, attempt) =>
        attempt === 0 ? key : `${key}_${attempt}`,
    },
  };

  const validator = {
    ...defaults.validator,
    ...createPatternPropertyKeyValidator(({ patternProperties }) => {
      const keys = Object.keys(patternProperties);
      return `Must match "${keys.length < 2 ? keys[0] : keys.join('" or "')}"`;
    }),
  };

  const form = createForm({
    ...defaults,
    schema,
    uiSchema,
    validator,
    onSubmit: console.log,
  });
</script>

<BasicForm {form} />
