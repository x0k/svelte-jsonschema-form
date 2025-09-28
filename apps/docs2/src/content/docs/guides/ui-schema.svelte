<script lang="ts">
  import { type Schema, type UiSchemaRoot, SimpleForm } from "@sjsf/form";

  import * as defaults from "@/lib/form/defaults";

  const schema: Schema = {
    type: "string",
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

<SimpleForm
  {...defaults}
  {schema}
  {uiSchema}
  onSubmit={(v) => window.alert(v)}
/>
