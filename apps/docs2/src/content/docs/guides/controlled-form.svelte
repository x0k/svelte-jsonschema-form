<script lang="ts">
  import { BasicForm, createForm, type Schema } from "@sjsf/form";

  import * as defaults from "@/components/form-defaults";

  const schema: Schema = {
    type: "string",
  };

  let value = $state("initial");

  const form = createForm({
    ...defaults,
    schema,
    value: [() => value, (v) => (value = v)],
    onSubmit: console.log,
  });
</script>

<BasicForm {form} />

<pre>{JSON.stringify(value, null, 2)}</pre>
