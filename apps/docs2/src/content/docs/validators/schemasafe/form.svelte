<script lang="ts">
  import { ON_INPUT, BasicForm } from "@sjsf/form";
  import { createFormValidator } from "@sjsf/schemasafe-validator";

  import { createMyForm } from "@/components/my-form";

  import { initialValue, schema, uiSchema } from "../shared";

  const validator = createFormValidator({
    uiSchema,
  });

  const form = createMyForm({
    schema,
    uiSchema,
    validator,
    fieldsValidationMode: ON_INPUT,
    initialValue,
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(form.value, null, 2)}</pre>
