<script lang="ts">
  import {
    BasicForm,
    createForm,
    ON_ARRAY_CHANGE,
    ON_CHANGE,
    ON_INPUT,
  } from "@sjsf/form";
  import { setupFormValidator } from "@sjsf/valibot-validator";
  import * as v from "valibot";

  import * as defaults from "@/components/form-defaults";

  import { initialValue, uiSchema } from "../shared";

  const vSchema = v.object({
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
  type Value = v.InferInput<typeof vSchema>;

  const { schema, validator } = setupFormValidator(vSchema, { uiSchema });

  const form = createForm({
    ...defaults,
    schema,
    uiSchema,
    validator,
    fieldsValidationMode: ON_INPUT | ON_CHANGE | ON_ARRAY_CHANGE,
    initialValue: initialValue as Value,
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(form.value, null, 2)}</pre>
