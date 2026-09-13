<script lang="ts">
  import { ON_CHANGE, ON_INPUT, BasicForm, createForm } from "@sjsf/form";

  import { getDemoContext } from "@/lib/demo";

  import { objectSchema } from "../demo-schemas";

  const { defaults } = getDemoContext();

  const form = createForm({
    ...defaults,
    schema: objectSchema,
    fieldsValidationMode: ON_INPUT | ON_CHANGE,
  });
</script>

<BasicForm {form} novalidate />
