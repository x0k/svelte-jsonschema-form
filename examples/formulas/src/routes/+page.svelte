<script lang="ts">
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
    return (value: SchemaObjectValue | undefined) => {
      if (value === undefined) {
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
</script>

<BasicForm {form} />
