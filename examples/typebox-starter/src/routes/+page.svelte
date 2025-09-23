<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";
  import { createFormValueValidator } from "@sjsf/form/validators/standard-schema";
  import Type from "typebox";
  import { Compile } from "typebox/compile";

  import * as defaults from "$lib/form-defaults";

  const schema = Type.Object({
    hello: Type.String(),
  });

  const form = createForm({
    ...defaults,
    createValidator: (options) => ({
      ...createFormValueValidator(
        //@ts-expect-error
        Compile(schema),
        options
      ),
      isValid: () => true,
    }),
    schema,
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
