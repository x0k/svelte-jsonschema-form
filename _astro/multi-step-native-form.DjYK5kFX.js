import{r as e}from"./rolldown-runtime.C0FnF6B9.js";import{a as t,i as n,n as r,r as i}from"./model.BHx2IYJR.js";var a=`import type { InitialFormData } from "@sjsf/sveltekit";
import { createFormHandler } from "@sjsf/sveltekit/server";
import { fail } from "@sveltejs/kit";

import * as defaults from "$lib/sjsf/defaults";

import type { Actions } from "./$types";
import { schema, STEP_KEY, stepNames, type Stepped } from "./model";

export const load = async () => {
  return {
    form: {
      schema,
      initialValue: {
        [STEP_KEY]: "first",
      },
    } satisfies InitialFormData<Stepped>,
  };
};

const handleForm = createFormHandler<Stepped, true>({
  ...defaults,
  schema,
  sendData: true,
});

export const actions = {
  default: async ({ request }) => {
    const [form] = await handleForm(request.signal, await request.formData());
    if (!form.isValid) {
      return fail(400, { form });
    }
    const index = stepNames.indexOf(form.data[STEP_KEY]);
    if (index < stepNames.length - 1) {
      form.isValid = false as true;
      form.data[STEP_KEY] = stepNames[index + 1];
    } else {
      // all steps completed
      console.log(form.data);
    }
    return {
      form,
    };
  },
} satisfies Actions;
`,o=`<script lang="ts">
  import {
    setFormContext,
    Content,
    SubmitButton,
    type Config,
    getValueSnapshot,
  } from "@sjsf/form";
  import { isRecord } from "@sjsf/form/lib/object";
  import { fromFactories } from "@sjsf/form/lib/resolver";
  import { createMeta, setupSvelteKitForm } from "@sjsf/sveltekit/client";

  import * as defaults from "$lib/sjsf/defaults";

  import type { ActionData, PageData } from "./$types";
  import { STEP_KEY } from "./model";

  const meta = createMeta<ActionData, PageData>().form;

  const { form } = setupSvelteKitForm(meta, {
    ...defaults,
    extraUiOptions: fromFactories({
      layouts: (config: Config) =>
        config.path.length === 1
          ? {
              "object-property": {
                get style(): string {
                  // NOTE: Calling \`getValueSnapshot\` here will cause the styles
                  // to be recalculated whenever the form values change.
                  // If performance is critical for you can use controlled form
                  const snap = getValueSnapshot(form);
                  const step = isRecord(snap) && snap[STEP_KEY];
                  return \`display: \${
                    config.path[0] === step ? "block" : "none"
                  }\`;
                },
              },
            }
          : undefined,
    }),
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
`,s=`import type { Schema } from "@sjsf/form";

export const steps = {
  first: {
    type: "object",
    properties: {
      name: {
        type: "string",
        title: "Name",
        minLength: 1,
      },
    },
    required: ["name"],
  },
  second: {
    type: "object",
    properties: {
      email: {
        type: "string",
        title: "Email",
        format: "email",
      },
    },
    required: ["email"],
  },
} as const satisfies Record<string, Schema>;

export type StepName = keyof typeof steps;

export const STEP_KEY = "step";

export type RootKey = StepName | typeof STEP_KEY;

export interface Stepped {
  [STEP_KEY]: StepName;
}

export const stepNames = Object.keys(steps) as StepName[];

export const rootKeys = (stepNames as RootKey[]).concat(STEP_KEY);

export const schema = {
  type: "object",
  properties: {
    [STEP_KEY]: {
      type: "string",
      enum: stepNames,
    },
  },
  required: [STEP_KEY],
  dependencies: {
    step: {
      oneOf: stepNames.map((stepName, i) => {
        const required = stepNames.slice(0, i + 1);
        const entries: [RootKey, Schema][] = required.map((stepName) => [
          stepName,
          steps[stepName],
        ]);
        entries.push([STEP_KEY, { const: stepName }]);
        return {
          properties: Object.fromEntries(entries),
          required,
        };
      }),
    },
  },
} as const satisfies Schema;
`,c=e({default:()=>u,meta:()=>l}),l=t({category:r.SvelteKitIntegrations,title:`Multi-step Native Form`,description:`Multi-step form using native HTML form submission.`,tags:[i.FormActions]}),u=n({sveltekit:`formActions`,files:{"src/routes/+page.server.ts":a,"src/routes/+page.svelte":o,"src/routes/model.ts":s}});export{c as n,l as t};