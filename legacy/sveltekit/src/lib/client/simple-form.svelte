<script
  lang="ts"
  generics="Meta extends SvelteKitFormMeta<any, any, string, any>"
>
  import { BasicForm } from "@sjsf/form";

  import {
    setupSvelteKitForm,
    type SvelteKitFormSetupOptions,
  } from "./form.svelte.js";
  import type { SvelteKitFormMeta } from "./meta.js";

  type Props = SvelteKitFormSetupOptions<Meta> & {
    meta: Meta;
  };

  const props: Props = $props();

  const { form } = setupSvelteKitForm(props.meta, props);
</script>

<BasicForm {form} method="POST" />
