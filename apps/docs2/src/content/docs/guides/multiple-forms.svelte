<script lang="ts">
  import { type Schema, SimpleForm } from "@sjsf/form";

  import * as defaults from "@/lib/form/defaults";

  const schema: Schema = {
    type: "string",
  };
</script>

<div style="display: flex; gap: 1rem; justify-content: space-around;">
  <SimpleForm
    {...defaults}
    {schema}
    initialValue="foo"
    idPrefix="form1"
    onSubmit={(v) => window.alert(v)}
  />
  <SimpleForm
    {...defaults}
    {schema}
    initialValue="bar"
    idPrefix="form2"
    onSubmit={(v) => window.alert(v)}
  />
</div>
