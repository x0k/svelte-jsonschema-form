<script lang="ts">
  import { SimpleForm } from "@sjsf/form";
  import { resolver } from "@sjsf/form/resolvers/basic";
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/basic-theme";
</script>

<SimpleForm
  {theme}
  {translation}
  {resolver}
  schema={{
    type: "object",
    title: 'Form title',
    properties: {
      text: {
        type: "string",
        title: "Simple text input",
      },
    },
    required: ["text"],
  }}
  validator={{ isValid: () => true }}
  onSubmit={(v: { text: string }) => window.alert(v.text)}
/>
