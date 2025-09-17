const e=`<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";
  import { createFormValueValidator } from "@sjsf/form/validators/standard-schema";
  import Type from "typebox";
  import { Compile } from "typebox/compile";

  import * as defaults from "$lib/form-defaults";

  const schema = Type.Object({
    hello: Type.String(),
  });

  const form = createForm({
    ...defaults,
    createValidator: (options) => ({
      ...createFormValueValidator({
        ...options,
        // @ts-expect-error
        schema: Compile(schema),
      }),
      isValid: () => true,
    }),
    schema,
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
`,t="typebox-starter",s="0.0.1",n="module",o={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},c={"@sveltejs/adapter-auto":"^6.1.0","@sveltejs/kit":"^2.28.0","@sveltejs/vite-plugin-svelte":"^6.1.2",svelte:"^5.38.1","svelte-check":"^4.3.1",typescript:"^5.9.2",vite:"^7.1.2"},r={"@sjsf/basic-theme":"^3.0.0-next.1","@sjsf/form":"^3.0.0-next.1",typebox:"^1.0.7"},i={name:t,private:!0,version:s,type:n,scripts:o,devDependencies:c,dependencies:r},a={package:i,files:{"src/routes/+page.svelte":e}};export{a as layer};
