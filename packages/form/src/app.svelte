<script lang="ts">
  import { Form2, type Schema } from "./form/index.js";
  import { theme } from "./basic-theme/index.js";
  import { translation } from "./translations/en.js";
  import { createValidator } from "./fake-validator.js";

  const schema: Schema = {
    type: 'string'
  };

  const validator = createValidator();
</script>

<Form2 {...theme} {schema} {translation} {validator} />
