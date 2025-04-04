<script lang="ts">
  import type { Schema } from "@sjsf/form";
  import { createFormValidator } from "@sjsf/ajv8-validator";

  import MyForm from "@/components/my-form.svelte";

  const schema: Schema = {
    type: "string",
  };
</script>

<div style="display: flex; gap: 1rem; justify-content: space-around;">
  <MyForm
    {schema}
    initialValue="foo"
    idPrefix="form1"
    validator={createFormValidator({
      idPrefix: "form1",
    })}
    onSubmit={(v: string) => window.alert(v)}
  />
  <MyForm
    {schema}
    initialValue="bar"
    idPrefix="form2"
    validator={createFormValidator({
      idPrefix: "form2",
    })}
    onSubmit={(v: string) => window.alert(v)}
  />
</div>
