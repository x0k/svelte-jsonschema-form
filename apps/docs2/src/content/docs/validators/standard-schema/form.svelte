<script lang="ts">
  import { BasicForm, createForm, type Schema } from "@sjsf/form";
  import { createFormValueValidator } from "@sjsf/form/validators/standard-schema";
  import { type } from "arktype";

  import * as defaults from "@/lib/form/defaults";

  import { initialValue, uiSchema } from "../shared";

  const schema = type({
    "id?": "string>=8&/^\\d+$/",
    "active?": "boolean",
    "skills?": "(string>=5)[]>=4",
    "multipleChoicesList?": "('foo'|'bar'|'fuzz')[]<=2",
  });

  type Value = typeof schema.infer;

  const form = createForm({
    ...defaults,
    schema: schema.toJsonSchema({
      dialect: "https://json-schema.org/draft-07/schema",
    }) as Schema,
    uiSchema,
    validator: {
      ...createFormValueValidator(schema),
      isValid: () => true,
    },
    initialValue: initialValue as Value,
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(form.value, null, 2)}</pre>
