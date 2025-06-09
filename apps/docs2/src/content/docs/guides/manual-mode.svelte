<script lang="ts">
  import type { FromSchema } from "json-schema-to-ts";
  import {
    createForm,
    Form,
    Field,
    SubmitButton,
    type Schema,
    setFormContext,
  } from "@sjsf/form";

  import * as defaults from "@/components/form-defaults";

  const schema = {
    type: "object",
    properties: {
      login: {
        title: "Login",
        type: "string",
        minLength: 1,
      },
      password: {
        title: "Password",
        type: "string",
        minLength: 6,
      },
    },
    required: ["login", "password"],
    additionalProperties: false,
  } as const satisfies Schema;

  type Value = FromSchema<typeof schema>;

  const form = createForm({
    ...defaults,
    schema,
    onSubmit(value: Value) {
      console.log(value);
    },
  });
  setFormContext(form.context);
</script>

<Form>
  <Field {form} name="login" required />
  <p>Yes, you can place fields manually!</p>
  <Field
    {form}
    name="password"
    required
    uiSchema={{ "ui:options": { text: { type: "password" } } }}
  />
  <SubmitButton />
</Form>
