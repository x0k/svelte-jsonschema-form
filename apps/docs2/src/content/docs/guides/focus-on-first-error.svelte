<script lang="ts">
  import { SimpleForm } from "@sjsf/form";
  import { createFocusOnFirstError } from "@sjsf/form/focus-on-first-error";

  import * as defaults from "@/lib/form/defaults";

  import { objectSchema, objectUiSchema } from "./demo-schemas";
</script>

<SimpleForm
  {...defaults}
  schema={objectSchema}
  uiSchema={objectUiSchema}
  onSubmitError={createFocusOnFirstError()}
/>
