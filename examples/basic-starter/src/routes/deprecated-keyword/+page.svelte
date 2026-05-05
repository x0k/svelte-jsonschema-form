<script lang="ts" module>
  declare module "@sjsf/form" {
    interface Schema {
      deprecated?: boolean;
    }
  }
</script>

<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { fromFactories } from "@sjsf/form/lib/resolver";
  import { createForm, BasicForm, type Schema, type Config } from "@sjsf/form";

  import * as defaults from "$lib/form-defaults";

  const schema = {
    type: "object",
    title: "Basic form",
    properties: {
      foo: {
        type: "string",
      },
      bar: {
        type: "string",
        deprecated: true,
      },
    },
    required: ["hello"],
  } as const satisfies Schema;

  const form = createForm({
    ...defaults,
    schema,
    extraUiOptions: fromFactories({
      layouts: (config: Config) => ({
        "object-property": config.schema.deprecated
          ? ({
              style:
                "padding: 0.5rem; border: solid 1px orange; border-radius: 5px;",
            } satisfies HTMLAttributes<HTMLDivElement>)
          : undefined,
      }),
      action: (config: Config) =>
        config.schema.deprecated ? deprecated : undefined,
    }),
    onSubmit: console.log,
  });
</script>

{#snippet deprecated()}
  <span>(deprecated)</span>
{/snippet}

<BasicForm {form} />
