<script lang="ts">
  import type { FromSchema } from "json-schema-to-ts";
  import {
    createForm,
    Field,
    type Schema,
    setFormContext,
    enhance,
  } from "@sjsf/form";

  import * as defaults from "@/components/form-defaults";

  const schema = {
    type: "object",
    properties: {
      login: {
        title: "Login",
        type: "string",
        minLength: 3,
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

  const form = createForm({
    ...defaults,
    schema,
    onSubmit(value: FromSchema<typeof schema>) {
      console.log(value);
    },
  });
  setFormContext(form.context);
</script>

<form
  novalidate
  use:enhance={form.context}
  style="display: flex; flex-direction: column; gap: 1rem;"
>
  <Field {form} name="login" required />
  <Field
    {form}
    name="password"
    required
    uiSchema={{ "ui:options": { text: { type: "password" } } }}
  />
  <button type="submit">Submit</button>
</form>
