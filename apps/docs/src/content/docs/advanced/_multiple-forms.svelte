<script lang="ts">
  import { createForm2, type Schema } from "@sjsf/form";
  import { createValidator2 } from "@sjsf/ajv8-validator";
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/form/basic-theme";

  import Form from "./_multiple-forms-form.svelte";

  const schema: Schema = {
    type: "string",
  };

  const common = {
    ...theme,
    schema,
    translation,
    validator: createValidator2(),
    onSubmit: (v: string) => window.alert(v),
  };

  const [form1, form1Ctx] = createForm2({
    ...common,
    initialValue: "foo",
    idPrefix: "form1",
  });

  const [form2, form2Ctx] = createForm2({
    ...common,
    initialValue: "bar",
    idPrefix: "form2",
  });
</script>

<div style="display: flex; gap: 1rem;">
  <Form
    style="display: flex; flex-direction: column; gap: 1rem; flex-grow: 1;"
    form={form1}
    ctx={form1Ctx}
  />
  <Form
    style="display: flex; flex-direction: column; gap: 1rem; flex-grow: 1;"
    form={form2}
    ctx={form2Ctx}
  />
</div>
