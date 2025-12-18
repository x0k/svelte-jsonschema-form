import{p as e}from"./package.DexCkx4w.js";import{F as t}from"./shared.ZvCroodS.js";import{o as n}from"./advanced-examples.BCskX6p3.js";import"./each.CHt_oZ7U.js";import"./render.C_940HXN.js";import"./definitions.BbyctBGF.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.C71rkuzW.js";import"./preload-helper.BUFao3bW.js";import"./buttons.ORSZS0zg.js";/* empty css                                                       *//* empty css                                                                 */const o=`import { fail } from "@sveltejs/kit";
import type { InitialFormData } from "@sjsf/sveltekit";
import { createFormHandler } from "@sjsf/sveltekit/server";

import * as defaults from "$lib/form-defaults";

import { schema, STEP_KEY, stepNames, type Stepped } from "./model";
import type { Actions } from "./$types";

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
`,s=`<script lang="ts">
  import { fromFactories } from "@sjsf/form/lib/resolver";
  import { isRecord } from '@sjsf/form/lib/object'
  import {
    setFormContext,
    Content,
    SubmitButton,
    type Config,
    getValueSnapshot,
  } from "@sjsf/form";
  // WARN: You must export this ID Builder in your \`defaults\` file
  import { createFormIdBuilder } from "@sjsf/sveltekit";
  import { createMeta, setupSvelteKitForm } from "@sjsf/sveltekit/client";

  import * as defaults from "$lib/form-defaults";

  import type { ActionData, PageData } from "./$types";
  import { STEP_KEY } from "./model";

  const meta = createMeta<ActionData, PageData>().form;

  const { form } = setupSvelteKitForm(meta, {
    ...defaults,
    idBuilder: createFormIdBuilder,
    extraUiOptions: fromFactories({
      layouts: (config: Config) =>
        config.path.length === 1
          ? {
              "object-property": {
                get style(): string {
                  const snap = getValueSnapshot(form)
                  const step = isRecord(snap) && snap[STEP_KEY]
                  return \`display: \${
                    // NOTE: Remember that each call to form.value causes a new
                    // form state snapshot to be created.
                    // If performance is critical for you can use controlled form
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
`,r=`import type { Schema } from "@sjsf/form";

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
`,g={package:n(e),formDefaults:{idBuilderPackage:t},files:{"src/routes/+page.server.ts":o,"src/routes/+page.svelte":s,"src/routes/model.ts":r}};export{g as layer};
