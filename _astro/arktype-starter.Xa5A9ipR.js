var e=`<script lang="ts">
  import { createForm, BasicForm, type Schema } from "@sjsf/form";
  import { createFormValueValidator } from "@sjsf/form/validators/standard-schema";
  import { type } from "arktype";

  import * as defaults from "$lib/form-defaults";

  const schema = type({
    hello: "string",
  });

  const form = createForm({
    ...defaults,
    validator: {
      ...createFormValueValidator(schema),
      isValid: () => true,
    },
    schema: schema.toJsonSchema({
      dialect: null,
    }) as Schema,
    uiSchema: {
      "ui:options": {
        title: "Basic form",
      },
      hello: {
        "ui:options": {
          title: "Hello",
        },
      },
    },
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} />
`,t={package:{name:`arktype-starter`,private:!0,version:`0.0.12`,type:`module`,scripts:{dev:`vite dev`,preview:`vite preview`,prepare:`svelte-kit sync || echo ''`,check:`svelte-kit sync && svelte-check --tsconfig ./tsconfig.json`,"check:watch":`svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch`},devDependencies:{"@sveltejs/adapter-auto":`^6.1.0`,"@sveltejs/kit":`^2.49.5`,"@sveltejs/vite-plugin-svelte":`^6.1.2`,svelte:`^5.46.4`,"svelte-check":`^4.3.1`,typescript:`^5.9.2`,vite:`^7.1.2`},dependencies:{"@sjsf/basic-theme":`workspace:*`,"@sjsf/form":`workspace:*`,arktype:`^2.1.21`}},files:{"src/routes/+page.svelte":e}};export{t as layer};