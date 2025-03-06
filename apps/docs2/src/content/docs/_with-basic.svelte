<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/basic-theme";
  import "@sjsf/basic-theme/extra-widgets/textarea-include";

  import { schema, uiSchema, initialValue } from "./_schema";
  import { validator } from "./_validator";
  import { onSubmit } from './_on-submit';

  const form = createForm({
    theme,
    initialValue,
    schema,
    uiSchema,
    validator,
    translation,
    onSubmit,
  });
</script>

<BasicForm {form} />

<pre>{JSON.stringify(form.value, null, 2)}</pre>
