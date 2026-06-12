<script lang="ts">
  import {
    BasicForm,
    createForm,
    getValueSnapshot,
    ON_ARRAY_CHANGE,
    ON_CHANGE,
    ON_INPUT,
  } from "@sjsf/form";
  import { createFormValidator } from "@sjsf/cfworker-validator";

  import { getDemoContext } from "@/lib/demo";

  import { initialValue, schema, uiSchema } from "../demo-schema";

  const { defaults } = getDemoContext();

  const form = createForm({
    ...defaults,
    schema,
    uiSchema,
    validator: createFormValidator,
    fieldsValidationMode: ON_INPUT | ON_CHANGE | ON_ARRAY_CHANGE,
    initialValue,
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
