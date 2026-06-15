<script lang="ts">
  import { localization } from "@sjsf-lab/hyperjump-validator/localizations/en-us";
  import { createFormValidatorFactory } from "@sjsf-lab/hyperjump-validator/precompile";
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { resolver } from "@sjsf/form/resolvers/compat";
  import { createValidatorRetriever } from "@sjsf/form/validators/precompile";
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
      validatorRetriever: createValidatorRetriever({
        registry: {
          get(id) {
            const schemaUri = `${id}#`;
            return schemaUri in ast
              ? {
                  schemaUri,
                  ast,
                }
              : undefined;
          },
        },
      }),
      localization,
    }),
    fieldsValidationMode,
    resolver,
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
