<script lang="ts">
  import { localization } from "@sjsf-lab/hyperjump-validator/localizations/en-us";
  import {
    createFormValidatorFactory,
    fromAst,
  } from "@sjsf-lab/hyperjump-validator/precompile";
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { resolver } from "@sjsf/form/resolvers/compat";
  import "@hyperjump/json-schema/formats-lite";
  import "@hyperjump/json-schema/draft-07";

  import { getDemoContext } from "@/lib/demo";

  import { ast } from "./ast";
  import { schema, fieldsValidationMode } from "./patched-schema";

  const { defaults } = getDemoContext();

  const form = createForm({
    ...defaults,
    schema,
    validator: createFormValidatorFactory({
      validatorRetriever: fromAst(ast),
      localization,
    }),
    fieldsValidationMode,
    resolver,
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
