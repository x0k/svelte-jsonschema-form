import{p as t}from"./package.wfED_5Uj.js";import{o as n}from"./advanced-examples.BMdL78Aj.js";import"./each.BEO3Vq6I.js";import"./render.BbHDAxyr.js";import"./definitions.iJbBEcx_.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.CdzS3xvw.js";import"./shared.6XT6ak91.js";import"./preload-helper.1-HTDuIo.js";import"./buttons.DX8xHpeH.js";/* empty css                                                       *//* empty css                                                                 */const e=`import type { Schema } from "@sjsf/form";
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
