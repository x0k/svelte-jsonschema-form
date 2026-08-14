import{r as e}from"./rolldown-runtime.C0FnF6B9.js";import{a as t,i as n,n as r,r as i}from"./model.BHx2IYJR.js";var a=`import type { Schema } from "@sjsf/form";
import type { InitialFormData } from "@sjsf/sveltekit";
import { createAction } from "@sjsf/sveltekit/server";

import * as defaults from "$lib/sjsf/defaults";

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
`,o=`<script lang="ts">
  import { setFormContext, Content, SubmitButton } from "@sjsf/form";
  import { createMeta, setupSvelteKitForm } from "@sjsf/sveltekit/client";

  import * as defaults from "$lib/sjsf/defaults";

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
`,s=e({default:()=>l,meta:()=>c}),c=t({category:r.SvelteKitIntegrations,title:`Form Actions Without JS`,description:`Form actions with JavaScript disabled.`,tags:[i.FormActions,i.NoJs]}),l=n({sveltekit:`formActions`,files:{"src/routes/+page.server.ts":a,"src/routes/+page.svelte":o}});export{c as n,s as t};