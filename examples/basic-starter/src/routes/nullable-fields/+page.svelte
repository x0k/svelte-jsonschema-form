<script lang="ts">
  import {
    createForm,
    BasicForm,
    type Schema,
    type FormState,
    type ResolveFieldType,
    getValueSnapshot,
  } from "@sjsf/form";
  import { extendByRecord } from "@sjsf/form/lib/resolver";

  import * as defaults from "$lib/sjsf/defaults";

  import nullableField, { isNullableField } from "./nullable-field.svelte";

  const schema = {
    type: "object",
    title: "Nullable fields",
    properties: {
      foo: {
        anyOf: [
          {
            type: "string",
            title: "Foo",
          },
          {
            type: "null",
          },
        ],
      },
      bar: {
        anyOf: [
          {
            type: "null",
          },
          {
            type: "number",
            title: "Bar",
          },
        ],
      },
      baz: {
        anyOf: [
          {
            type: "object",
            title: "Nested",
            properties: {
              hello: {
                type: "boolean",
              },
            },
          },
          {
            type: "null",
          },
        ],
      },
    },
    required: ["foo"],
  } as const satisfies Schema;

  function resolver<T>(ctx: FormState<T>): ResolveFieldType {
    const resolve = defaults.resolver(ctx);
    return (config) => {
      if (isNullableField(config.schema)) {
        return "nullableField";
      }
      return resolve(config);
    };
  }

  const form = createForm({
    ...defaults,
    theme: extendByRecord(defaults.theme, {
      nullableField,
    }),
    resolver,
    schema,
    onSubmit: console.log,
  });
</script>

<BasicForm {form} novalidate />

<pre><code>{JSON.stringify(getValueSnapshot(form), null, 2)}</code></pre>
