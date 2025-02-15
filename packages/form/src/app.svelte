<script lang="ts">
  import {
    createForm,
    SimpleForm,
    setFromContext,
    type Schema,
    createTranslation,
    createTheme,
  } from "./form/index.js";
  import { themeResolver } from "./basic-theme/index.js";
  import { translationResolver } from "./translations/en.js";
  import { createValidator } from "./fake-validator.js";

  const schema: Schema = {
    type: "string",
  };

  const validator = createValidator();
  const translation = createTranslation(translationResolver);
  const theme = createTheme(themeResolver);

  const form = createForm({
    theme,
    schema,
    translation,
    validator,
  });
  setFromContext(form.context);
</script>

<SimpleForm />
