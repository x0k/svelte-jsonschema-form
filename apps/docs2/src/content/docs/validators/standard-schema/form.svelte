<script lang="ts">
  import { BasicForm, createForm, type Validator } from "@sjsf/form";
  import { createFormValueValidator } from "@sjsf/form/validators/standard-schema";
  import { toJsonSchema } from "@valibot/to-json-schema";
  import * as v from "valibot";

  import * as defaults from "@/components/form-defaults";

  import { initialValue, uiSchema } from "../shared";

  const schema = v.object({
    id: v.optional(
      v.pipe(
        v.string(),
        v.regex(new RegExp("^\\d+$"), "Must be a number"),
        v.minLength(8)
      )
    ),
    active: v.optional(v.boolean()),
    skills: v.optional(
      v.pipe(v.array(v.pipe(v.string(), v.minLength(5))), v.minLength(4))
    ),
    multipleChoicesList: v.optional(
      v.pipe(v.array(v.picklist(["foo", "bar", "fuzz"])), v.maxLength(2))
    ),
  });

  type Value = v.InferInput<typeof schema>;

  const validator = {
    ...createFormValueValidator({ schema, uiSchema }),
    isValid: () => true,
  } satisfies Validator;

  const form = createForm({
    ...defaults,
    schema: toJsonSchema(schema, {}),
    uiSchema,
    validator,
    initialValue: initialValue as Value
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(form.value, null, 2)}</pre>
