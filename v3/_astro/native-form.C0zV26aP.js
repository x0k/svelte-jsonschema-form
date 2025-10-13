import{o as t}from"./advanced-examples.FHGKvaFr.js";import"./_commonjsHelpers.jSTVcZ1w.js";import"./render.BHiezTN2.js";import"./definitions.DlirAx7C.js";import"./snippet.7ZyTRIBg.js";import"./shared.CWXdVpU6.js";import"./preload-helper.1-HTDuIo.js";import"./buttons.CvusaXZ_.js";/* empty css                                                       *//* empty css                                                                 */const e="native-form",n="0.0.1",s="module",o={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},a={"@sveltejs/adapter-auto":"^6.1.0","@sveltejs/kit":"^2.46.0","@sveltejs/vite-plugin-svelte":"^6.1.2",svelte:"^5.39.0","svelte-check":"^4.3.1",typescript:"^5.9.2",vite:"^7.1.2"},r={"@sjsf/ajv8-validator":"^3.0.0-next.7","@sjsf/basic-theme":"^3.0.0-next.7","@sjsf/form":"^3.0.0-next.7","@sjsf/sveltekit":"^3.0.0-next.7",ajv:"^8.17.1"},i={name:e,private:!0,version:n,type:s,scripts:o,devDependencies:a,dependencies:r},m=`import type { Schema } from "@sjsf/form";
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
  defaults: createAction(
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
`,c=`<script lang="ts">
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
`,h={package:t(i),files:{"src/routes/+page.server.ts":m,"src/routes/+page.svelte":c}};export{h as layer};
