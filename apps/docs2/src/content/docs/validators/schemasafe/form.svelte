<script lang="ts">
  import {
    ON_INPUT,
    BasicForm,
    createForm,
    ON_CHANGE,
    ON_ARRAY_CHANGE,
  } from "@sjsf/form";
  import { createFormValidator } from "@sjsf/schemasafe-validator";

  import * as defaults from "@/lib/form/defaults";

  import { initialValue, schema, uiSchema } from "../shared";

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

<pre>{JSON.stringify(form.value, null, 2)}</pre>
