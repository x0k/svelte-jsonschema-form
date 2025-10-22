import{p as e}from"./package.wfED_5Uj.js";import{o as n}from"./advanced-examples.BMdL78Aj.js";import"./each.BEO3Vq6I.js";import"./render.BbHDAxyr.js";import"./definitions.iJbBEcx_.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.CdzS3xvw.js";import"./shared.6XT6ak91.js";import"./preload-helper.1-HTDuIo.js";import"./buttons.DX8xHpeH.js";/* empty css                                                       *//* empty css                                                                 */const t=`import { fail } from "@sveltejs/kit";
import type { InitialFormData } from "@sjsf/sveltekit";
import { isValid, createFormHandler } from "@sjsf/sveltekit/server";

import * as defaults from "$lib/form-defaults";

import { schema, STEP_KEY, stepNames, type Stepped } from "./model";
import type { Actions } from "./$types";

const handleForm = createFormHandler({
  ...defaults,
  schema,
  sendData: true,
});

export const load = async () => {
  return {
    form: {
      schema,
      initialValue: {
        [STEP_KEY]: "first",
      } satisfies Stepped,
    } satisfies InitialFormData,
  };
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
`,s=`<script lang="ts">
  import { fromFactories } from "@sjsf/form/lib/resolver";
  import {
    setFormContext,
    Content,
    SubmitButton,
    type Config,
  } from "@sjsf/form";
  import { createMeta, setupSvelteKitForm } from "@sjsf/sveltekit/client";

  import * as defaults from "$lib/form-defaults";

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
                  return \`display: \${
                    // NOTE: Remember that each call to form.value causes a new
                    // form state snapshot to be created.
                    // If performance is critical for you can use controlled form
                    config.path[0] === form.value?.[STEP_KEY] ? "block" : "none"
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
`,o=`import type { Schema } from "@sjsf/form";

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
`,E={package:n(e),files:{"src/routes/+page.server.ts":t,"src/routes/+page.svelte":s,"src/routes/model.ts":o}};export{E as layer};
