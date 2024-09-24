<script lang="ts">
  import Ajv from "ajv";

  import { components } from "@/lib/components";
  import { widgets } from "@/lib/widgets";
  import { AjvValidator } from "@/lib/validator";
  import { translation } from "@/lib/translation/en";
  import { Form, type Schema, type UiSchemaRoot } from "@/components/form";

  const validator = new AjvValidator(
    new Ajv({
      allErrors: true,
      multipleOfPrecision: 8,
      strict: false,
      verbose: true,
      discriminator: true,
    })
  );
  const schema: Schema = {
    title: "A registration form",
    description: "A simple form example.",
    type: "object",
    required: ["firstName", "lastName"],
    properties: {
      firstName: {
        type: "string",
        title: "First name",
        default: "Chuck",
      },
      lastName: {
        type: "string",
        title: "Last name",
      },
      age: {
        type: "integer",
        title: "Age",
      },
      bio: {
        type: "string",
        title: "Bio",
      },
      password: {
        type: "string",
        title: "Password",
        minLength: 3,
      },
      telephone: {
        type: "string",
        title: "Telephone",
        minLength: 10,
      },
    },
  };
  const uiSchema: UiSchemaRoot = {
    "ui:options": {},
  };
  let value = $state();
</script>

<div class="p-2">
  <div class="text-3xl font-bold pb-2">Playground</div>
  <div class="flex gap-2">
    <div class="flex-[3] flex flex-col gap-2">
      <div class="h-[400px] border rounded overflow-auto p-2">
        <pre class="w-0"><code>{JSON.stringify(schema, null, 2)}</code></pre>
      </div>
      <div class="flex gap-2">
        <div class="h-[400px] flex-1 border rounded overflow-auto p-2">
          <pre class="w-0"><code>{JSON.stringify(uiSchema, null, 2)}</code
            ></pre>
        </div>
        <div class="h-[400px] flex-1 border rounded overflow-auto p-2">
          <pre class="w-0"><code>{JSON.stringify(value, null, 2)}</code></pre>
        </div>
      </div>
    </div>
    <Form
      class="flex-[2]"
      bind:value
      {components}
      {widgets}
      {schema}
      {uiSchema}
      {validator}
      {translation}
    >
      <div class="flex gap-2" >
        <button type="submit"> Submit </button>
        <button type="button"
          onclick={() => {
            value = { age: 123 };
          }}
        >
          Outside mutation
        </button>
      </div>
    </Form>
  </div>
</div>
