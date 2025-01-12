<script lang="ts">
  import { SimpleForm, type Schema, type UiSchemaRoot } from "@sjsf/form";

  import { createCustomForm } from "@/components/custom-form";

  const schema: Schema = {
    type: "string",
    title: "Simple text input",
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

  const form = createCustomForm({
    schema,
    uiSchema,
    onSubmit: console.log,
  });
</script>

<SimpleForm {form} style="display: flex; flex-direction: column; gap: 1rem" />
