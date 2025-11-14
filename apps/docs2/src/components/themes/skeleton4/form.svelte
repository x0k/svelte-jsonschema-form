<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot, type ExtraUiOptions } from "@sjsf/form";

  import {
    schema,
    uiSchema,
    initialValue,
    type CreateUser,
    withFile,
  } from "../data";
  import * as defaults from "./defaults";

  const { extraUiOptions }: { extraUiOptions: ExtraUiOptions } = $props()

  const form = createForm<CreateUser>({
    ...defaults,
    // required due to several forms on the page
    idPrefix: "skeleton4",
    initialValue,
    schema,
    uiSchema,
    onSubmit: ({ name }) => window.alert(`Hello, ${name}`),
    // to work in Shadow DOM
    extraUiOptions,
  });
</script>

<BasicForm {form} />

<pre>{JSON.stringify(getValueSnapshot(form), withFile, 2)}</pre>
