import{t as e}from"./shared.CoEygnNS.js";import{a as t}from"./layer.CM9lDGEW.js";import{t as n}from"./package.BCY5EkHc.js";var r=`import type { Schema } from "@sjsf/form";
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

interface CreateUser {
  firstName: string;
  lastName: string;
  age: number;
}

export const load = async () => {
  return { form: { schema } satisfies InitialFormData<CreateUser> };
};

export const actions = {
  default: createAction(
    {
      ...defaults,
      name: "form",
      schema,
      sendData: true,
    },
    (data: CreateUser) => {
      console.log(data);
    }
  ),
} satisfies Actions;
`,i=`<script lang="ts">
  import { setFormContext, Content, SubmitButton } from "@sjsf/form";
  // WARN: You must export this ID Builder in your \`defaults\` file
  import { createFormIdBuilder } from "@sjsf/sveltekit";
  import { createMeta, setupSvelteKitForm } from "@sjsf/sveltekit/client";

  import * as defaults from "$lib/form-defaults";

  import type { ActionData, PageData } from "./$types";

  const meta = createMeta<ActionData, PageData>().form;

  const { form } = setupSvelteKitForm(meta, {
    ...defaults,
    idBuilder: createFormIdBuilder,
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
`,a={package:t(n),formDefaults:{idBuilderPackage:e},files:{"src/routes/+page.server.ts":r,"src/routes/+page.svelte":i}};export{a as layer};