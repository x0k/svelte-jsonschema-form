<script lang="ts">
  // WARN: You must export this ID Builder in your `defaults` file
  import { createFormIdBuilder } from "@sjsf/sveltekit/rf";
  import { connect } from "@sjsf/sveltekit/rf/client";

  import * as defaults from "$lib/form-defaults";

  import { createPost, getInitialData } from "./data.remote";
  import FormContent from './form-content.svelte';

  const initialData = await getInitialData();

  const formOptions = await connect(
    createPost,
    {
      ...defaults,
      ...initialData,
      idBuilder: createFormIdBuilder,
    }
  )
</script>

<form
  method={createPost.method}
  action={createPost.action}
  style="display: flex; flex-direction: column; gap: 1rem;"
  novalidate
>
  <FormContent {formOptions} />
</form>
