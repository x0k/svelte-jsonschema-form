import{p as t}from"./package.TpDzObST.js";import{o as n}from"./advanced-examples.DS8dmNvb.js";import"./each.mpKmeHYv.js";import"./render.gEp3m_LP.js";import"./definitions.DHCzoh2g.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.Dj95Z4E7.js";import"./shared.DfRIL9pD.js";import"./preload-helper.1-HTDuIo.js";import"./buttons.CEFJ03XP.js";/* empty css                                                       *//* empty css                                                                 */const e=`import type { Schema } from "@sjsf/form";
import type { InitialFormData } from "@sjsf/sveltekit";
import { createAction } from "@sjsf/sveltekit/server";

import * as defaults from "$lib/form-defaults";

import type { Actions } from "./$types";

const schema: Schema = {
  title: "Registration form",
  type: "object",
  properties: {
    firstName: {
      type: "string",
      title: "First name",
    },
    lastName: {
      type: "string",
      title: "Last name",
    },
    age: {
      type: "number",
      title: "Age",
      minimum: 21,
    },
  },
  required: ["firstName", "lastName", "age"],
};

interface Value {
  firstName: string;
  lastName: string;
  age: number;
}

export const load = async () => {
  return { form: { schema } satisfies InitialFormData };
};

export const actions = {
  default: createAction(
    {
      ...defaults,
      name: "form",
      schema,
      sendData: true,
    },
    (data: Value) => {
      console.log(data);
    }
  ),
} satisfies Actions;
`,o=`<script lang="ts">
  import { setFormContext, Content, SubmitButton } from "@sjsf/form";
  import { createMeta, setupSvelteKitForm } from "@sjsf/sveltekit/client";

  import * as defaults from "$lib/form-defaults";

  import type { ActionData, PageData } from "./$types";

  const meta = createMeta<ActionData, PageData>().form;

  const { form } = setupSvelteKitForm(meta, {
    ...defaults,
    onSubmit: console.log,
  });
  setFormContext(form);
<\/script>

<form
  novalidate
  method="POST"
  style="display: flex; flex-direction: column; gap: 1rem;"
>
  <Content />
  <SubmitButton />
</form>
`,y={package:n(t),files:{"src/routes/+page.server.ts":e,"src/routes/+page.svelte":o}};export{y as layer};
