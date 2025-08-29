<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";

  import { schema, uiSchema, initialValue } from "../data";
  import * as defaults from "./defaults";

  const form = createForm({
    ...defaults,
    // required due to several forms on the page
    idPrefix: "basic",
    initialValue,
    schema,
    uiSchema,
    onSubmit: ({ name }) => window.alert(`Hello, ${name}`),
  });
</script>

<BasicForm {form} />

<pre>{JSON.stringify(form.value, null, 2)}</pre>
