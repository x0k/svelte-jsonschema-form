<script lang="ts">
  import { ON_CHANGE, ON_INPUT, SimpleForm } from "@sjsf/form";

  import { getDemoContext } from "@/lib/demo";

  import { objectSchema, objectUiSchema } from "../demo-schemas";

  const { defaults } = getDemoContext();
</script>

<SimpleForm
  {...defaults}
  schema={objectSchema}
  uiSchema={objectUiSchema}
  fieldsValidationMode={ON_INPUT | ON_CHANGE}
/>
