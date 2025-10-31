<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot, type Schema } from "@sjsf/form";
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
    initialValue: initialValue,
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
