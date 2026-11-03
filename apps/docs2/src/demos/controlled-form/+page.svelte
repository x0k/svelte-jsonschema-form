<script lang="ts">
  import { BasicForm, createForm, type Schema } from "@sjsf/form";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  const schema: Schema = {
    type: "string",
  };

  let value = $state("initial");

  const form = createForm<string>({
    ...defaults,
    schema,
    value: [() => value, (v) => (value = v)],
    onValid: console.log,
  });
</script>

<BasicForm {form} />

<button type="button" onclick={() => (value = "changed outside the form")}>
  Change outside the form
</button>

<pre>{JSON.stringify(value, null, 2)}</pre>
