<script lang="ts">
  import { SimpleForm } from "@sjsf/form";
  import { resolver } from "@sjsf/form/resolvers/basic";
  import { translation } from "@sjsf/form/translations/en";
  import { createFormMerger } from "@sjsf/form/mergers/modern";
  import { createFormIdBuilder } from '@sjsf/form/id-builders/modern';
  import { theme } from "@sjsf/basic-theme";
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
  validator={() => ({ isValid: () => true })}
  onSubmit={(v: { text: string }) => window.alert(v.text)}
/>
