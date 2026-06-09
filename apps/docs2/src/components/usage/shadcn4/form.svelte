<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { setThemeContext } from "@sjsf/shadcn4-theme";
  import * as components from "@sjsf/shadcn4-theme/new-york";
  import * as extraComponents from "@sjsf-lab/shadcn-extras-theme/ui";

  import {
    schema,
    uiSchema,
    initialValue,
    type CreateUser,
    withFile,
  } from "../model";
  import * as defaults from "./defaults";

  const form = createForm<CreateUser>({
    ...defaults,
    // required due to several forms on the page
    idPrefix: "shadcn4",
    initialValue,
    schema,
    uiSchema,
    onSubmit: ({ name }) => window.alert(`Hello, ${name}`),
  });

  setThemeContext({ components: { ...components, ...extraComponents } });
</script>

<BasicForm {form} />

<pre>{JSON.stringify(getValueSnapshot(form), withFile, 2)}</pre>
