<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  import { createFormValidator } from "@sjsf/schemasafe-validator/precompile";
  import { resolver } from "@sjsf/form/resolvers/compat";

  import * as defaults from "@/lib/form/defaults";

  import { schema, fieldsValidationMode } from "./patched-schema";
  import * as validateFunctions from "./validate-functions";

  const form = createForm({
    ...defaults,
    schema,
    createValidator: (options) =>
      createFormValidator({ ...options, validateFunctions }),
    fieldsValidationMode,
    resolver,
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(form.value, null, 2)}</pre>
