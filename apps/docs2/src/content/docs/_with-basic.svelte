<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";
  import { resolver } from "@sjsf/form/resolvers/basic";
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/basic-theme";
  import "@sjsf/basic-theme/extra-widgets/textarea-include";

  import { schema, uiSchema, initialValue } from "./_schema";
  import { createValidator } from "./_validator";
  import { onSubmit } from "./_on-submit";

  const form = createForm({
    idPrefix: "basic",
    validator: createValidator("basic"),
    theme,
    resolver,
    initialValue,
    schema,
    uiSchema,
    translation,
    onSubmit,
  });
</script>

<BasicForm {form} />

<pre>{JSON.stringify(form.value, null, 2)}</pre>
