import{o as e}from"./advanced-examples.D_fIIJdq.js";import"./_commonjsHelpers.C5egQ0e2.js";import"./render.quMNdmta.js";import"./function.D98mwl4F.js";import"./shared.CAJoasGh.js";import"./preload-helper.BUFao3bW.js";import"./buttons.DaWDJUQI.js";/* empty css                                                       *//* empty css                                                                 */const t="multi-step-native-form",n="0.0.1",s="module",o={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},r={"@sveltejs/adapter-auto":"^6.0.0","@sveltejs/kit":"^2.16.0","@sveltejs/vite-plugin-svelte":"^5.0.0",svelte:"^5.33.0","svelte-check":"^4.0.0",typescript:"^5.0.0",vite:"^6.2.6"},a={"@sjsf/ajv8-validator":"^2.1.1","@sjsf/basic-theme":"^2.1.1","@sjsf/form":"^2.1.1","@sjsf/sveltekit":"^2.1.1",ajv:"^8.17.1"},i={name:t,private:!0,version:n,type:s,scripts:o,devDependencies:r,dependencies:a},m=`import { fail } from "@sveltejs/kit";
import type { AnyFormValueValidatorError, SchemaValue } from "@sjsf/form";
import type { ValidatedFormData } from "@sjsf/sveltekit";
import {
  initForm,
  makeFormDataParser,
  validateForm,
} from "@sjsf/sveltekit/server";

import { validator } from "$lib/form-defaults";

import { schema, STEP_KEY, stepNames, type Stepped } from "./model";
import type { Actions } from "./$types";

const parseFormData = makeFormDataParser({
  validator,
});

export const load = async () => {
  const form = initForm({
    schema: schema,
    sendSchema: true,
    initialValue: {
      [STEP_KEY]: "first",
    } satisfies Stepped & SchemaValue,
  });
  return { form };
};

type ValidatedForm = ValidatedFormData<
  AnyFormValueValidatorError<typeof validator>,
  true
>;

function isValidForm(form: ValidatedForm): form is ValidatedForm & {
  data: Stepped;
} {
  return form.isValid;
}

export const actions = {
  default: async ({ request }) => {
    const data = await parseFormData({
      request,
      schema: schema,
    });
    const form = await validateForm({
      sendData: true,
      request,
      schema: schema,
      validator,
      data,
    });
    if (!isValidForm(form)) {
      return fail(400, { form });
    }
    const index = stepNames.indexOf(form.data[STEP_KEY]);
    if (index < stepNames.length - 1) {
      form.isValid = false;
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
`,p=`<script lang="ts">
  import { fromFactories } from "@sjsf/form/lib/resolver";
  import {
    setFormContext,
    Content,
    SubmitButton,
    type Config,
    pathToId,
  } from "@sjsf/form";
  import { createMeta, setupSvelteKitForm } from "@sjsf/sveltekit/client";

  import * as defaults from "$lib/form-defaults";

  import type { ActionData, PageData } from "./$types";
  import { rootKeys, STEP_KEY } from "./model";

  const meta = createMeta<ActionData, PageData>().form;

  const rootIds = new Set(rootKeys.map((l) => pathToId([l])));
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
                    // If performance is critical for you, use:
                    // \`\`\`ts
                    // import type { FormInternalContext } from "@sjsf/form";
                    // import type { Value } from "./model";
                    // ...
                    // const stateRef = (
                    //   form.context as FormInternalContext<
                    //     typeof defaults.validator
                    //   >
                    // ).value as Value;
                    // \`\`\`
                    // and \`stateRef.step\`
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
  setFormContext(form.context);
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
`,g={package:e(i),files:{"src/routes/+page.server.ts":m,"src/routes/+page.svelte":p,"src/routes/model.ts":c}};export{g as layer};
