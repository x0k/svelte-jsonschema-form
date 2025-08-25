<script lang="ts">
  import { type Schema, createForm, Field, formHandlers } from "@sjsf/form";
  import type { FromSchema } from "json-schema-to-ts";

  import * as defaults from "@/lib/form/defaults";

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
</script>

<form
  novalidate
  {@attach formHandlers(form)}
  style="display: flex; flex-direction: column; gap: 1rem;"
>
  <Field {form} name="login" />
  <Field
    {form}
    name="password"
    uiSchema={{ "ui:options": { text: { type: "password" } } }}
  />
  <button type="submit">Submit</button>
</form>
