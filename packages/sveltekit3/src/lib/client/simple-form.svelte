<script
  lang="ts"
  generics="Meta extends SvelteKitFormMeta<any, any, string, any>"
>
  import { BasicForm, validate } from "@sjsf/form";
  import type { HTMLFormAttributes } from "svelte/elements";

  import {
    setupSvelteKitForm,
    type SvelteKitFormSetupOptions,
  } from "./form.svelte.js";
  import type { SvelteKitFormMeta } from "./meta.js";

  type Props = SvelteKitFormSetupOptions<Meta> & {
    meta: Meta;
    enctype?: HTMLFormAttributes["enctype"];
    action?: HTMLFormAttributes["action"];
    novalidate?: HTMLFormAttributes["novalidate"];
  };

  const props: Props = $props();

  // svelte-ignore state_referenced_locally
  const { form, request } = setupSvelteKitForm(props.meta, props);
</script>

<BasicForm
  {form}
  method="POST"
  enctype={props.enctype}
  action={props.action}
  novalidate={props.novalidate}
  onsubmit={(e) => {
    e.preventDefault();
    void validate(form, {
      onValid: (value) => {
        void request.run(value, e);
      },
    });
  }}
/>
