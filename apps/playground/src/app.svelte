<script lang="ts">
  import Ajv from "ajv";

  import { components } from "@/lib/components";
  import { widgets } from "@/lib/widgets";
  import { AjvValidator } from "@/lib/validator";
  import { enTranslation } from "@/lib/translation";
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
    type: "string",
    title: "Text",
    enum: ["foo", "bar", "baz"],
  };
  const uiSchema: UiSchemaRoot = {
    "ui:options": {
      submitButton: {
        class:
          "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
      },
    },
  };
  let value = $state<string>();
</script>

<div class="p-2">
  <div class="text-3xl font-bold pb-2">Playground</div>
  <div class="flex gap-2">
    <div class="flex-[3] flex flex-col gap-2">
      <div class="h-[400px] border rounded overflow-auto">
        <pre class="w-0" ><code>{JSON.stringify(schema, null, 2)}</code></pre>
      </div>
      <div class="flex gap-2">
        <div class="h-[400px] flex-1 border rounded overflow-auto">
          <pre class="w-0" ><code>{JSON.stringify(uiSchema, null, 2)}</code></pre>
        </div>
        <div class="h-[400px] flex-1 border rounded overflow-auto">
          <pre class="w-0" ><code>{JSON.stringify(value, null, 2)}</code></pre>
        </div>
      </div>
    </div>
    <Form
      class="flex-[2]"
      {components}
      {widgets}
      {schema}
      {uiSchema}
      {validator}
      translation={enTranslation}
      bind:value
    />
  </div>
</div>
