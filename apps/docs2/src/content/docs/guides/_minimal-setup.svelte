<script lang="ts">
  import { SimpleForm } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/basic-theme";
</script>

<SimpleForm
  {theme}
  {translation}
  schema={{
    type: "object",
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
