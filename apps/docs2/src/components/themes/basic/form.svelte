<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";

  import { schema, uiSchema, initialValue } from "../schema";
  import { createMyValidator } from "../validator";
  import { onSubmit } from "../on-submit";

  import * as defaults from "./defaults";

  const validator = createMyValidator(defaults);
  const form = createForm({
    ...defaults,
    validator,
    initialValue,
    schema,
    uiSchema,
    onSubmit,
  });
</script>

<BasicForm {form} />

<pre>{JSON.stringify(form.value, null, 2)}</pre>
