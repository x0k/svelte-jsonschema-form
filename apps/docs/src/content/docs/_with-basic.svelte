<script lang="ts">
  import { createForm3, SimpleForm } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/form/basic-theme";

  import { schema, uiSchema, initialValue } from "./_schema";
  import { validator } from "./_validator";
  import { onSubmit } from './_on-submit';

  const form = createForm3({
    ...theme,
    initialValue,
    schema,
    uiSchema,
    validator,
    translation,
    onSubmit,
  });
</script>

<SimpleForm {form} style="display: flex; flex-direction: column; gap: 1rem;" />

<pre>{JSON.stringify(form.value, null, 2)}</pre>
