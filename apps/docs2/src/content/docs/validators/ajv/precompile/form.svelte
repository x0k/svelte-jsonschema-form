<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  import { createFormValidator } from "@sjsf/ajv8-validator/precompile";
  import { resolver } from "@sjsf/form/resolvers/compat";

  import * as defaults from "@/components/form-defaults";

  import { schema, fieldsValidationMode } from "./patched-schema";
  import * as validateFunctions from "./validate-functions";

  const validator = createFormValidator({ validateFunctions });

  const form = createForm({
    ...defaults,
    schema,
    validator,
    fieldsValidationMode,
    resolver,
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(form.value, null, 2)}</pre>
