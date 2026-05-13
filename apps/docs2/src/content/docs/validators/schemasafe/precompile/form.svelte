<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { fromValidators } from "@sjsf/form/validators/precompile";
  import { createFormValidatorFactory } from "@sjsf/schemasafe-validator/precompile";
  import { resolver } from "@sjsf/form/resolvers/compat";

  import * as defaults from "@/lib/form/defaults";

  import { schema, fieldsValidationMode } from "./patched-schema";
  import * as validateFunctions from "./validate-functions";

  const form = createForm({
    ...defaults,
    schema,
    validator: createFormValidatorFactory({
      validatorRetriever: fromValidators(validateFunctions),
    }),
    fieldsValidationMode,
    resolver,
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
