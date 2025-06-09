<script lang="ts">
  import { ON_INPUT, BasicForm, createForm } from "@sjsf/form";
  import { createFormValidator } from "@sjsf/schemasafe-validator";

  import * as defaults from "@/components/form-defaults";

  import { initialValue, schema, uiSchema } from "../shared";

  const validator = createFormValidator({
    uiSchema,
  });

  const form = createForm({
    ...defaults,
    schema,
    uiSchema,
    validator,
    fieldsValidationMode: ON_INPUT,
    initialValue,
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(form.value, null, 2)}</pre>
