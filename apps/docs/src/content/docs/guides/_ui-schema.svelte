<script lang="ts">
  import type { Schema, UiSchemaRoot } from "@sjsf/form";

  import CustomForm from "@/components/custom-form.svelte";

  const schema: Schema = {
    title: "Schema title",
    type: "string",
  };

  const uiSchema: UiSchemaRoot = {
    "ui:options": {
      title: "Custom title",
      help: "Help text",
      input: {
        placeholder: "placeholder",
      },
    },
  };
</script>

<CustomForm {schema} {uiSchema} onSubmit={console.log} />
