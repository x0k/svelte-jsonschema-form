import{o as e}from"./advanced-examples.v7vtmJrT.js";import"./_commonjsHelpers.DeY__IKx.js";import"./render.BvCbmumc.js";import"./definitions.WtXJsyQU.js";import"./snippet.B_3_pwki.js";import"./shared.CYkDYwLW.js";import"./preload-helper.1-HTDuIo.js";import"./buttons.DZ7xREMG.js";/* empty css                                                       *//* empty css                                                                 */const t="multi-step-native-form",n="0.0.1",s="module",o={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},r={"@sveltejs/adapter-auto":"^6.1.0","@sveltejs/kit":"^2.38.1","@sveltejs/vite-plugin-svelte":"^6.1.2",svelte:"^5.38.1","svelte-check":"^4.3.1",typescript:"^5.9.2",vite:"^7.1.2"},a={"@sjsf/ajv8-validator":"^3.0.0-next.1","@sjsf/basic-theme":"^3.0.0-next.1","@sjsf/form":"^3.0.0-next.1","@sjsf/sveltekit":"^3.0.0-next.1",ajv:"^8.17.1"},i={name:t,private:!0,version:n,type:s,scripts:o,devDependencies:r,dependencies:a},m=`import { fail } from "@sveltejs/kit";
import type { SchemaValue } from "@sjsf/form";
import { initForm, isValid, createFormHandler } from "@sjsf/sveltekit/server";

import * as defaults from "$lib/form-defaults";

import { schema, STEP_KEY, stepNames, type Stepped } from "./model";
import type { Actions } from "./$types";

const handleForm = createFormHandler({
  ...defaults,
  schema,
  sendData: true,
});

export const load = async () => {
  const form = initForm({
    schema: schema,
    sendSchema: true,
    initialValue: {
      [STEP_KEY]: "first",
    } as const satisfies Stepped & SchemaValue,
  });
  return { form };
};

export const actions = {
  default: async ({ request }) => {
    const [form, data] = await handleForm(
      request.signal,
      await request.formData()
    );
    if (!isValid<Stepped>(form, data)) {
      return fail(400, { form });
    }
    const index = stepNames.indexOf(data[STEP_KEY]);
    if (index < stepNames.length - 1) {
      form.isValid = false;
      data[STEP_KEY] = stepNames[index + 1];
    } else {
      // all steps completed
      console.log(data);
    }
    return {
      form,
    };
  },
} satisfies Actions;
`,p=`<script lang="ts">
  import { fromFactories } from "@sjsf/form/lib/resolver";
  import {
    setFormContext,
    Content,
    SubmitButton,
    type Config,
    idFromPath,
  } from "@sjsf/form";
  import { createMeta, setupSvelteKitForm } from "@sjsf/sveltekit/client";

  import * as defaults from "$lib/form-defaults";

  import type { ActionData, PageData } from "./$types";
  import { rootKeys, STEP_KEY } from "./model";

  const meta = createMeta<ActionData, PageData>().form;

  const rootIds = new Set(rootKeys.map((l) => idFromPath([l])));
  const { form } = setupSvelteKitForm(meta, {
    ...defaults,
    extraUiOptions: fromFactories({
      layouts: (config: Config) =>
        rootIds.has(config.id)
          ? {
              "object-property": {
                get style(): string {
                  return \`display: \${
                    // NOTE: Remember that each call to form.value causes a new
                    // form state snapshot to be created.
                    // If performance is critical for you can use controlled form
                    config.id.endsWith(form.value?.[STEP_KEY]!)
                      ? "block"
                      : "none"
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
`,c=`import type { Schema } from "@sjsf/form";

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
`,j={package:e(i),files:{"src/routes/+page.server.ts":m,"src/routes/+page.svelte":p,"src/routes/model.ts":c}};export{j as layer};
