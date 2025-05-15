<script lang="ts">
  import { BasicForm } from "@sjsf/form";
  import { createFormValidator } from "@sjsf/ajv8-validator/precompile";
  import { resolver } from "@sjsf/form/resolvers/compat";

  import { createMyForm } from "@/components/my-form";

  import { schema, fieldsValidationMode } from "./patched-schema";
  import * as validateFunctions from "./validate-functions";

  const validator = createFormValidator({ validateFunctions });

  const form = createMyForm({
    schema,
    validator,
    fieldsValidationMode,
    resolver,
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(form.value, null, 2)}</pre>
