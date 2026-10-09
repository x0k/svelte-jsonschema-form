<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { resolver } from "@sjsf/form/resolvers/compat";
  import { fromValidators } from "@sjsf/form/validators/precompile";
  import { createFormValidatorFactory } from "@sjsf/hyperjump-validator/precompile";
  import "@hyperjump/json-schema/formats-lite";
  import "@hyperjump/json-schema/draft-07";

  import { getDemoContext } from "@/lib/demo";

  import { schema, fieldsValidationMode } from "./patched-schema";
  import { validators } from "./validators.generated";

  const { defaults } = getDemoContext();

  const form = createForm({
    ...defaults,
    schema,
    validator: createFormValidatorFactory({
      validatorRetriever: fromValidators(validators),
    }),
    fieldsValidationMode,
    resolver,
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
