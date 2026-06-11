<script lang="ts">
  import { chain, fromFactories, fromRecord } from "@sjsf/form/lib/resolver";
  import { Content, createForm, setFormContext, type Config } from "@sjsf/form";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  const form = createForm({
    ...defaults,
    schema: {
      type: "object",
      properties: {
        foo: {
          type: "string",
        },
        bar: {
          type: "number",
        },
      },
    },
    extraUiOptions: chain(
      fromRecord({
        labelAttributes: {
          style: "color: red",
        },
      }),
      fromFactories({
        help: (config: Config) => `${config.title} help`,
      })
    ),
  });
  setFormContext(form);
</script>

<Content />
