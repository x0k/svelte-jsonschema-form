<script lang="ts">
  import { BasicForm, createForm, reset } from "@sjsf/form";
  import { connect } from "@sjsf/sveltekit/rf/client";

  import type { Model } from "$lib/post";
  import * as defaults from "$lib/sjsf/remote-defaults";

  import { createPost, getInitialData } from "./data.remote";

  const initialData = await getInitialData();

  createPost.enhance(async ({ submit }) => {
    if (await submit()) {
      console.log(createPost.result);
      reset(form);
    }
  });

  const form = createForm(
    await connect<Model>(createPost, {
      ...defaults,
      ...initialData,
    })
  );
</script>

<BasicForm {form} novalidate />
