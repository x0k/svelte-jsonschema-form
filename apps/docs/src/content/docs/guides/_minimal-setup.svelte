<script lang="ts">
  import { Form2 } from "@sjsf/form";
  import { theme } from '@sjsf/form/basic-theme'
  import { createValidator } from '@sjsf/form/fake-validator'
  import { translation } from '@sjsf/form/translations/en'
</script>

<Form2
  {...theme}
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
  validator={createValidator()}
  onSubmit={(v: { text: string }) => window.alert(v.text)}
/>
