<script lang="ts">
  import { createForm, BasicForm, getValueSnapshot } from "@sjsf/form";

  import {
    schema,
    uiSchema,
    initialValue,
    type Data,
    withFile,
  } from "../data";
  import * as defaults from "./defaults";

  const form = createForm({
    ...defaults,
    // required due to several forms on the page
    idPrefix: "basic",
    initialValue,
    schema,
    uiSchema,
    onSubmit: ({ name }: Data) => window.alert(`Hello, ${name}`),
  });
</script>

<BasicForm {form} />

<pre>{JSON.stringify(getValueSnapshot(form), withFile, 2)}</pre>
