const n=`<script lang="ts">
  import { fromFactories } from "@sjsf/form/lib/resolver";
  import { createForm, BasicForm, type Schema, type Config } from "@sjsf/form";

  import * as defaults from "$lib/form-defaults";

  const schema = {
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
  } as const satisfies Schema;

  const displayContents = {
    style: "display: contents",
  };

  const form = createForm({
    ...defaults,
    schema,
    onSubmit: console.log,
    extraUiOptions: fromFactories({
      layouts: (config: Config) =>
        config.path.length === 0
          ? {
              "object-properties": {
                class: "label-on-left",
              },
            }
          : {
              "object-property": displayContents,
              "object-property-content": displayContents,
              field: displayContents,
            },
    }),
  });
<\/script>

<BasicForm {form} />

<style>
  :global(.label-on-left) {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
    align-items: center;
  }
</style>
`,t={files:{"src/routes/+page.svelte":n}};export{t as layer};
