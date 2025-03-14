<script lang="ts">
  import type { Schema, UiSchemaRoot } from "@sjsf/form";

  import MyForm from "@/components/my-form.svelte";

  const schema: Schema = {
    type: "string",
    title: "Simple text input",
  };

  const uiSchema: UiSchemaRoot = {
    "ui:options": {
      title: "Custom title",
      help: "Help text",
      text: {
        placeholder: "placeholder",
      },
    },
  };
</script>

<MyForm {schema} {uiSchema} onSubmit={(v) => window.alert(v)} />
