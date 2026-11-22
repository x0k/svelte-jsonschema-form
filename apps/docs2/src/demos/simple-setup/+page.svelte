<script lang="ts">
  import { theme } from "@sjsf/basic-theme";
  import { SimpleForm } from "@sjsf/form";
  import { createFormIdBuilder } from "@sjsf/form/id-builders/modern";
  import { createLogger } from "@sjsf/form/loggers/once";
  import { createFormMerger } from "@sjsf/form/mergers/modern";
  import { resolver } from "@sjsf/form/resolvers/basic";
  import { translation } from "@sjsf/form/translations/en";
  import { createFormValidator } from "@sjsf/form/validators/noop";
  import { defaultFormValueHandler } from "@sjsf/form/value-handlers/default";
</script>

<SimpleForm
  {theme}
  {translation}
  {resolver}
  schema={{
    type: "object",
    title: "Form title",
    properties: {
      text: {
        type: "string",
        title: "Text input",
      },
    },
    required: ["text"],
  }}
  merger={createFormMerger}
  valueHandler={defaultFormValueHandler}
  logger={createLogger}
  idBuilder={createFormIdBuilder}
  validator={createFormValidator<{ text: string }>}
  onValid={(v) => window.alert(v.text)}
/>
