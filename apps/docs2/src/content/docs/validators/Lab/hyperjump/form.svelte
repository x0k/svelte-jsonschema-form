<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { createAsyncFormValidatorFactory } from "@sjsf-lab/hyperjump-validator";
  import { localization } from "@sjsf-lab/hyperjump-validator/localizations/en-us";
  import { resolver } from "@sjsf/form/resolvers/compat";
  import "@hyperjump/json-schema/draft-07";

  import * as defaults from "@/lib/form/defaults";

  import { schema, fieldsValidationMode } from "./patched-schema";
  import { ast } from "./ast";

  const form = createForm({
    ...defaults,
    schema,
    validator: createAsyncFormValidatorFactory({ ast, localization }),
    fieldsValidationMode,
    resolver,
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
