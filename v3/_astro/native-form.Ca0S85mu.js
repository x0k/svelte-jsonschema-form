import{o as t}from"./advanced-examples.4C0lg3hF.js";import"./_commonjsHelpers.DvvQDrIL.js";import"./render.ChLMm5WM.js";import"./function.Dn-kfttI.js";import"./shared.Gg_5Lxuo.js";import"./preload-helper.1-HTDuIo.js";import"./buttons.CZayUe1r.js";/* empty css                                                       *//* empty css                                                                 */const e="native-form",n="0.0.1",s="module",o={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},r={"@sveltejs/adapter-auto":"^6.1.0","@sveltejs/kit":"^2.38.1","@sveltejs/vite-plugin-svelte":"^6.1.2",svelte:"^5.38.1","svelte-check":"^4.3.1",typescript:"^5.9.2",vite:"^7.1.2"},a={"@sjsf/ajv8-validator":"^3.0.0-next.0","@sjsf/basic-theme":"^3.0.0-next.0","@sjsf/form":"^3.0.0-next.0","@sjsf/sveltekit":"^3.0.0-next.0",ajv:"^8.17.1"},i={name:e,private:!0,version:n,type:s,scripts:o,devDependencies:r,dependencies:a},m=`import { fail } from "@sveltejs/kit";
import type { Schema } from "@sjsf/form";
import {
  initForm,
  makeFormDataParser,
  validateForm,
} from "@sjsf/sveltekit/server";

import { createValidator } from '$lib/form-defaults'

import type { Actions } from "./$types";

const validator = createValidator()

const parseFormData = makeFormDataParser({
  validator,
});

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

export const load = async () => {
  const form = initForm({ schema, sendSchema: true });
  return { form };
};

export const actions = {
  default: async ({ request }) => {
    const data = await parseFormData({
      request,
      schema,
    });
    const form = await validateForm({
      sendData: true,
      request,
      schema,
      validator,
      data,
    });
    if (!form.isValid) {
      return fail(400, { form });
    }
    // TODO: Do something with \`data\`
    return {
      form,
    };
  },
} satisfies Actions;
`,c=`<script lang="ts">
  import { setFormContext2, Content, SubmitButton } from "@sjsf/form";
  import { createMeta, setupSvelteKitForm } from "@sjsf/sveltekit/client";

  import * as defaults from "$lib/form-defaults";

  import type { ActionData, PageData } from "./$types";

  const meta = createMeta<ActionData, PageData>().form;

  const { form } = setupSvelteKitForm(meta, {
    ...defaults,
    onSubmit: console.log,
  });
  setFormContext2(form);
<\/script>

<form
  novalidate
  method="POST"
  style="display: flex; flex-direction: column; gap: 1rem;"
>
  <Content />
  <SubmitButton />
</form>
`,k={package:t(i),files:{"src/routes/+page.server.ts":m,"src/routes/+page.svelte":c}};export{k as layer};
