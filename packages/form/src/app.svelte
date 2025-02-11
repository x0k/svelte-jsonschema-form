<script lang="ts">
  import {
    createForm3,
    SimpleForm,
    setFromContext,
    type Schema,
  } from "./form/index.js";
  import { theme } from "./basic-theme/index.js";
  import { translation } from "./translations/en.js";
  import { createValidator } from "./fake-validator.js";

  const schema: Schema = {
    type: "string",
  };

  const validator = createValidator();

  const form = createForm3({
    theme,
    schema,
    translation,
    validator,
  });
  setFromContext(form.context);
</script>

<SimpleForm />
