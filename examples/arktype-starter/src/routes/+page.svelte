<script lang="ts">
  import { createForm, BasicForm, type Schema } from "@sjsf/form";
  import { createFormValueValidator } from "@sjsf/form/validators/standard-schema";
  import { type } from "arktype";

  import * as defaults from "$lib/form-defaults";

  const schema = type({
    hello: "string",
  });

  const form = createForm({
    ...defaults,
    validator: {
      ...createFormValueValidator(schema),
      isValid: () => true,
    },
    schema: schema.toJsonSchema({
      dialect: null,
    }) as Schema,
    uiSchema: {
      "ui:options": {
        title: "Basic form",
      },
      hello: {
        "ui:options": {
          title: "Hello",
        },
      },
    },
    onSubmit: console.log,
  });
</script>

<BasicForm {form} />
