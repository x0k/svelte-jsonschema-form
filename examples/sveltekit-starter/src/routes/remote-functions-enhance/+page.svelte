<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  import { connect } from "@sjsf/sveltekit3/rf/client";

  import type { Model } from "#lib/post.js";
  import * as defaults from "#lib/sjsf/remote-defaults.js";

  import { createPost, getInitialData } from "./data.remote";

  const initialData = await getInitialData();

  createPost.enhance(async ({ submit }) => {
    if (await submit()) {
      console.log(createPost.result);
      form.reset();
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
