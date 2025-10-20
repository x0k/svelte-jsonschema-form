import{o as e}from"./advanced-examples.DjE-o313.js";import"./each.DhM-XGPy.js";import"./render.CY-GWpT0.js";import"./definitions.CGVh-kLN.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.Bm5Mkyxk.js";import"./shared.Dn26_Gyq.js";import"./preload-helper.1-HTDuIo.js";import"./buttons.CRu8rhDS.js";/* empty css                                                       *//* empty css                                                                 */const n="formulas",t="0.0.1",o="module",s={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},i={"@sveltejs/adapter-auto":"^6.1.0","@sveltejs/kit":"^2.42.0","@sveltejs/vite-plugin-svelte":"^6.1.2","json-schema-to-ts":"^3.1.1",svelte:"^5.41.0","svelte-check":"^4.3.1",typescript:"^5.9.2",vite:"^7.1.2"},r={"@sjsf/ajv8-validator":"^3.0.0-next.10","@sjsf/basic-theme":"^3.0.0-next.10","@sjsf/form":"^3.0.0-next.10",ajv:"^8.17.1"},c={name:n,private:!0,version:t,type:o,scripts:s,devDependencies:i,dependencies:r},a=`<script lang="ts">
  import type { SchemaObjectValue } from "@sjsf/form/core";
  import {
    createForm,
    BasicForm,
    type Schema,
    type UiSchemaRoot,
  } from "@sjsf/form";
  import type { FromSchema } from "json-schema-to-ts";

  import * as defaults from "$lib/form-defaults";

  import ObjectField from "./object-field.svelte";

  const schema = {
    title: "Invoice Form",
    type: "object",
    properties: {
      unitPrice: {
        type: "number",
        title: "Unit Price",
        minimum: 0,
      },
      quantity: {
        type: "integer",
        title: "Quantity",
        minimum: 0,
      },
      taxRate: {
        type: "number",
        title: "Tax Rate (%)",
        minimum: 0,
        maximum: 100,
        default: 20,
      },
      subtotal: {
        type: "number",
        title: "Subtotal",
      },
      taxAmount: {
        type: "number",
        title: "Tax Amount",
      },
      total: {
        type: "number",
        title: "Total",
      },
    },
    required: ["unitPrice", "quantity", "taxRate"],
    additionalProperties: false,
  } as const satisfies Schema;

  type Value = FromSchema<typeof schema>;

  function formula(
    property: keyof Value,
    calculate: (v: Required<Value>) => number
  ) {
    return (value: SchemaObjectValue | null | undefined) => {
      if (!value) {
        return;
      }
      let ignore = false;
      const proxy = new Proxy(value, {
        get(target, p) {
          const v = target[p as string];
          if (typeof v === "number") {
            return v;
          }
          ignore = true;
          return 0;
        },
      }) as Record<keyof Value, number>;
      const result = calculate(proxy);
      if (!ignore) {
        value[property] = result;
      }
    };
  }

  const uiSchema: UiSchemaRoot = {
    "ui:components": {
      objectField: ObjectField,
    },
    "ui:options": {
      myObjectEffects: [
        formula("subtotal", (o) => o.unitPrice * o.quantity),
        formula("taxAmount", (o) => (o.subtotal * o.taxRate) / 100),
        formula("total", (o) => o.subtotal + o.taxAmount),
      ],
    },
  };

  const form = createForm({
    ...defaults,
    schema,
    uiSchema,
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} />
`,m=`<script lang="ts" module>
  import type { SchemaObjectValue } from "@sjsf/form/core";

  declare module "@sjsf/form" {
    interface UiOptions {
      myObjectEffects?: ((
        value: SchemaObjectValue | null | undefined
      ) => void | (() => void))[];
    }
  }
<\/script>

<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";
  import Field from "@sjsf/form/fields/object/object-field.svelte";

  let {
    value = $bindable(),
    uiOption,
    ...rest
  }: ComponentProps["objectField"] = $props();

  const effects = $derived(uiOption("myObjectEffects"));

  $effect(() => {
    if (!effects) {
      return;
    }
    for (const fn of effects) {
      $effect(() => fn(value));
    }
  });
<\/script>

<Field bind:value {uiOption} {...rest} />
`,x={package:e(c),files:{"src/routes/+page.svelte":a,"src/routes/object-field.svelte":m}};export{x as layer};
