import type { Schema } from "@sjsf/form";

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
