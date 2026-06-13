<script lang="ts">
  import { SimpleForm } from "@sjsf/form";
  import { createFocusOnFirstError } from "@sjsf/form/focus-on-first-error";

  import { getDemoContext } from "@/lib/demo";

  import {
    objectSchema,
    objectUiSchema,
  } from "../demo-schemas";

  const { defaults } = getDemoContext();
</script>

<SimpleForm
  {...defaults}
  schema={objectSchema}
  uiSchema={objectUiSchema}
  onSubmitError={createFocusOnFirstError()}
/>
