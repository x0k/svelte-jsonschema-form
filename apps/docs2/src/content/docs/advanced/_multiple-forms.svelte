<script lang="ts">
  import type { Schema } from "@sjsf/form";
  import { createFormValidator } from "@sjsf/ajv8-validator";

  import CustomForm from "@/components/my-form.svelte";

  const schema: Schema = {
    type: "string",
  };
  const onSubmit = (v: string) => window.alert(v);
</script>

<div style="display: flex; gap: 1rem; justify-content: space-around;">
  <CustomForm
    {schema}
    {onSubmit}
    initialValue="foo"
    idPrefix="form1"
    validator={createFormValidator({
      idPrefix: "form1",
    })}
  />
  <CustomForm
    {schema}
    {onSubmit}
    initialValue="bar"
    idPrefix="form2"
    validator={createFormValidator({
      idPrefix: "form2",
    })}
  />
</div>
