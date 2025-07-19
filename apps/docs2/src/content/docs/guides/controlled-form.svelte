<script lang="ts">
  import { BasicForm, createForm, type Schema } from "@sjsf/form";

  import * as defaults from "@/components/form-defaults";

  const schema: Schema = {
    type: "string",
    minLength: 10,
  };

  let value = $state("initial");

  const form = createForm({
    ...defaults,
    schema,
    valueRef: {
      get current() {
        return value;
      },
      set current(v) {
        value = v;
      },
    },
    onSubmit: console.log,
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(
    { value: form.value, errors: Object.fromEntries(form.errors) },
    null,
    2
  )}</pre>
