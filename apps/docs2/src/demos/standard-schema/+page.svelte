<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { adapt } from "@sjsf/form/validators/standard-schema";
  import { type } from "arktype";

  import { getDemoContext } from "@/lib/demo";

  import { initialValue, uiSchema } from "../demo-schema";

  const { defaults } = getDemoContext();

  const schema = type({
    "id?": "string>=8&/^\\d+$/",
    "active?": "boolean",
    "skills?": "(string>=5)[]>=4",
    "multipleChoicesList?": "('foo'|'bar'|'fuzz')[]<=2",
  });

  const form = createForm({
    ...defaults,
    ...adapt(schema),
    uiSchema,
    initialValue: {
      ...initialValue,
      id: "123",
    },
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
