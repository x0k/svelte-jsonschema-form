<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  import { connect } from "@sjsf/sveltekit/rf/client";

  import type { CreatePost } from "$lib/post";
  import * as defaults from "$lib/sjsf/remote-defaults";

  import { createPost, getInitialData } from "./data.remote";

  const initialData = await getInitialData();

  createPost.enhance(async ({ submit }) => {
    if (await submit()) {
      console.log(createPost.result);
      form.reset();
    }
  });

  const form = createForm(
    await connect<CreatePost>(createPost, {
      ...defaults,
      ...initialData,
    })
  );
</script>

<BasicForm {form} novalidate />
