import{o as t}from"./advanced-examples.BwplXmgI.js";import"./_commonjsHelpers.C50WZpYe.js";import"./render.ByIQ4bwk.js";import"./array.Be5mtBsQ.js";import"./shared.FzfvnCJP.js";import"./preload-helper.1-HTDuIo.js";import"./buttons.DPXeq3S0.js";/* empty css                                                       *//* empty css                                                                 */const e="native-form",n="0.0.1",s="module",o={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},r={"@sveltejs/adapter-auto":"^6.1.0","@sveltejs/kit":"^2.38.1","@sveltejs/vite-plugin-svelte":"^6.1.2",svelte:"^5.38.1","svelte-check":"^4.3.1",typescript:"^5.9.2",vite:"^7.1.2"},a={"@sjsf/ajv8-validator":"^3.0.0-next.1","@sjsf/basic-theme":"^3.0.0-next.1","@sjsf/form":"^3.0.0-next.1","@sjsf/sveltekit":"^3.0.0-next.1",ajv:"^8.17.1"},i={name:e,private:!0,version:n,type:s,scripts:o,devDependencies:r,dependencies:a},m=`import { fail } from "@sveltejs/kit";
import type { Schema } from "@sjsf/form";
import { initForm, isValid, createFormHandler } from "@sjsf/sveltekit/server";

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

const handleForm = createFormHandler({
  ...defaults,
  schema,
  sendData: true,
});

export const load = async () => {
  const form = initForm({ schema, sendSchema: true });
  return { form };
};

export const actions = {
  default: async ({ request }) => {
    const [form, data] = await handleForm(
      request.signal,
      await request.formData()
    );
    if (!isValid<Value>(form, data)) {
      return fail(400, { form });
    }
    // TODO: Do something with \`data\`
    console.log(data);
    return {
      form,
    };
  },
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
`,j={package:t(i),files:{"src/routes/+page.server.ts":m,"src/routes/+page.svelte":c}};export{j as layer};
