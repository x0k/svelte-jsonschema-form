<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { createValidatorRetriever } from "@sjsf/form/validators/precompile";
  import { createFormValidatorFactory } from "@sjsf-lab/hyperjump-validator/precompile";
  import { localization } from "@sjsf-lab/hyperjump-validator/localizations/en-us";
  import { resolver } from "@sjsf/form/resolvers/compat";
  import "@hyperjump/json-schema/formats-lite";
  import "@hyperjump/json-schema/draft-07";

  import * as defaults from "@/lib/form/defaults";

  import { schema, fieldsValidationMode } from "./patched-schema";
  import { ast } from "./ast";

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
