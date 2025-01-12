<script lang="ts">
  import { createForm3, SimpleForm, type Schema } from "@sjsf/form";
  import { createValidator2 } from "@sjsf/ajv8-validator";
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/form/basic-theme";

  const schema: Schema = {
    type: "string",
  };

  const common = {
    ...theme,
    schema,
    translation,
    onSubmit: (v: string) => window.alert(v),
  };

  const form1 = createForm3({
    ...common,
    initialValue: "foo",
    idPrefix: "form1",
    validator: createValidator2({
      idPrefix: "form1",
    }),
  });

  const form2 = createForm3({
    ...common,
    initialValue: "bar",
    idPrefix: "form2",
    validator: createValidator2({
      idPrefix: "form2",
    }),
  });
</script>

<div style="display: flex; gap: 1rem;">
  <SimpleForm
    form={form1}
    style="display: flex; flex-direction: column; gap: 1rem; flex-grow: 1;"
  />
  <SimpleForm
    form={form2}
    style="display: flex; flex-direction: column; gap: 1rem; flex-grow: 1;"
  />
</div>
