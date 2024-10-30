<script lang="ts">
  import { SimpleForm, type Schema, type UiSchemaRoot } from "@sjsf/form";

  import { useCustomForm } from "@/components/custom-form.ts";

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

  const form = useCustomForm({
    schema,
    uiSchema,
    onSubmit: console.log,
  });
</script>

<SimpleForm {form} style="display: flex; flex-direction: column; gap: 1rem" />
