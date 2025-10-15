import{o as t}from"./advanced-examples.IZRt6_bi.js";import"./each.CCbNYC82.js";import"./render.BDRr2Iv9.js";import"./definitions.Alz4DWWs.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.DY_xRtDp.js";import"./shared.DCwJjTzT.js";import"./preload-helper.1-HTDuIo.js";import"./buttons.DwUW3yJp.js";/* empty css                                                       *//* empty css                                                                 */const e="native-form",n="0.0.1",s="module",o={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},r={"@sveltejs/adapter-auto":"^6.1.0","@sveltejs/kit":"^2.46.0","@sveltejs/vite-plugin-svelte":"^6.1.2",svelte:"^5.40.0","svelte-check":"^4.3.1",typescript:"^5.9.2",vite:"^7.1.2"},a={"@sjsf/ajv8-validator":"^3.0.0-next.8","@sjsf/basic-theme":"^3.0.0-next.8","@sjsf/form":"^3.0.0-next.8","@sjsf/sveltekit":"^3.0.0-next.8",ajv:"^8.17.1"},i={name:e,private:!0,version:n,type:s,scripts:o,devDependencies:r,dependencies:a},m=`import type { Schema } from "@sjsf/form";
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
`,x={package:t(i),files:{"src/routes/+page.server.ts":m,"src/routes/+page.svelte":c}};export{x as layer};
