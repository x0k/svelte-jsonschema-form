<script lang="ts" module>
  import type { Query } from "@sjsf/form/lib/task.svelte";
  import type { EnumOption, SchemaValue } from "@sjsf/form/core";

  declare module "@sjsf/form/fields/extra/remote-enum.svelte" {
    interface EnumOptionsQueries {
      foo: Query<[string], EnumOption<SchemaValue>[]>;
    }
  }
</script>

<script lang="ts">
  import { extendByRecord } from "@sjsf/form/lib/resolver";
  import { createQuery, debounce } from "@sjsf/form/lib/task.svelte";
  import {
    createForm,
    BasicForm,
    type Schema,
    type UiSchema,
    getValueSnapshot,
  } from "@sjsf/form";
  import remoteEnumField, {
    setEnumOptionsQueriesContext,
    type EnumOptionsQueries,
  } from "@sjsf/form/fields/extra/remote-enum.svelte";

  import * as defaults from "$lib/form-defaults";

  import { COUNTRIES } from "./countries";
  import comboboxWidget from "./combobox.svelte";

  const options: EnumOption<SchemaValue>[] = COUNTRIES.map((c) => ({
    id: c,
    disabled: false,
    label: c,
    value: c,
  }));

  const foo: EnumOptionsQueries["foo"] = createQuery({
    execute: debounce(async (s, filter) => {
      await new Promise((r) => setTimeout(r, 800));
      if (s.aborted || filter.length < 3) {
        return [];
      }
      const prefix = filter.trim().toLocaleLowerCase();
      return options.filter((o) =>
        o.label.toLocaleLowerCase().includes(prefix)
      );
    }),
  });

  setEnumOptionsQueriesContext({
    foo,
  });

  const schema = {
    title: "Search",
    type: "string",
  } as const satisfies Schema;

  const uiSchema: UiSchema = {
    "ui:components": {
      stringField: "remoteEnumField",
      selectWidget: "comboboxWidget",
    },
    "ui:options": {
      enumOptionsQuery: "foo",
    },
  };

  const form = createForm({
    ...defaults,
    theme: extendByRecord(defaults.theme, {
      remoteEnumField,
      comboboxWidget,
    }),
    schema,
    uiSchema,
    onSubmit: console.log,
  });
</script>

<BasicForm {form} />

<p>{getValueSnapshot(form) || "<no value>"}</p>
