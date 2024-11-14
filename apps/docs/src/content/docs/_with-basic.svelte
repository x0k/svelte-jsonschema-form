<script lang="ts">
  import { useForm2, SimpleForm } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/form/basic-theme";

  import { schema, uiSchema, initialValue } from "./_schema";
  import { validator } from "./_validator";

  const form = useForm2({
    ...theme,
    initialValue,
    schema,
    uiSchema,
    validator,
    translation,
  });
</script>

<SimpleForm {form} style="display: flex; flex-direction: column; gap: 1rem;" />

<pre>{JSON.stringify(form.value, null, 2)}</pre>
