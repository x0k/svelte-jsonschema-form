<script lang="ts">
  import {
    BasicForm,
    createForm,
    ON_ARRAY_CHANGE,
    ON_CHANGE,
    ON_INPUT,
  } from "@sjsf/form";
  import { createFormValidator } from "@sjsf/cfworker-validator";

  import * as defaults from "@/lib/form/defaults";

  import { initialValue, schema, uiSchema } from "../shared";

  const validator = createFormValidator({ uiSchema });

  const form = createForm({
    ...defaults,
    schema,
    uiSchema,
    validator,
    fieldsValidationMode: ON_INPUT | ON_CHANGE | ON_ARRAY_CHANGE,
    initialValue,
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(form.value, null, 2)}</pre>
