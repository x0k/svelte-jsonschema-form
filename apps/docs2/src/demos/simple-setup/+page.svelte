<script lang="ts">
  import { theme } from "@sjsf/basic-theme";
  import { SimpleForm } from "@sjsf/form";
  import { createFormIdBuilder } from "@sjsf/form/id-builders/modern";
  import { createFormMerger } from "@sjsf/form/mergers/modern";
  import { resolver } from "@sjsf/form/resolvers/basic";
  import { translation } from "@sjsf/form/translations/en";
  import { createFormValidator } from "@sjsf/form/validators/noop";
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
  idBuilder={createFormIdBuilder}
  validator={createFormValidator<{ text: string }>}
  onSubmit={(v) => window.alert(v.text)}
/>
