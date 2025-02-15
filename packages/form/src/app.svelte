<script lang="ts">
  import {
    createForm,
    SimpleForm,
    setFromContext,
    type Schema,
    createTranslation,
  } from "./form/index.js";
  import { theme } from "./basic-theme/index.js";
  import { translationResolver } from "./translations/en.js";
  import { createValidator } from "./fake-validator.js";

  const schema: Schema = {
    type: "string",
  };

  const validator = createValidator();
  const translation = createTranslation(translationResolver)

  const form = createForm({
    theme,
    schema,
    translation,
    validator,
  });
  setFromContext(form.context);
</script>

<SimpleForm />
