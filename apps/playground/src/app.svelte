<script lang="ts">
  import Ajv from "ajv";

  import { components } from "@/lib/components";
  import { widgets } from "@/lib/widgets";
  import { AjvValidator } from "@/lib/validator";
  import { translation } from "@/lib/translation/en";
  import { Form } from "@/components/form";
  import { ShadowHost } from "@/components/shadow";

  import { samples } from "./samples";

  let schema = $state(samples.Simple.schema);
  let uiSchema = $state(samples.Simple.uiSchema);
  let value = $state(samples.Simple.formData);

  const validator = new AjvValidator(
    new Ajv({
      allErrors: true,
      multipleOfPrecision: 8,
      strict: false,
      verbose: true,
      discriminator: true,
    })
  );
</script>

<div class="p-2">
  <div class="text-3xl font-bold pb-2">Playground</div>
  <div class="flex gap-2 flex-wrap pb-2">
    {#each Object.entries(samples) as [name, sample]}
      <button
        type="button"
        class="border rounded p-2"
        onclick={() => {
          schema = sample.schema;
          uiSchema = sample.uiSchema;
          value = sample.formData;
        }}
      >
        {name}
      </button>
    {/each}
  </div>
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
    <ShadowHost class="flex-[2]">
      <Form
        class="flex-[2]"
        bind:value
        {components}
        {widgets}
        {schema}
        {uiSchema}
        {validator}
        {translation}
      />
    </ShadowHost>
  </div>
</div>
