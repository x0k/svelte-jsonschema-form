<script lang="ts">
  import { BasicForm, createForm, reset } from "@sjsf/form";
  import { connect } from "@sjsf/sveltekit3/rf/client";

  import type { Model } from "#lib/post.js";
  import * as defaults from "#lib/sjsf/remote-defaults.js";

  import { createPost, getInitialData } from "./data.remote.js";

  const initialData = await getInitialData();

  createPost.enhance(async ({ submit }) => {
    if (await submit()) {
      console.log(createPost.result);
      reset(form);
    }
  });

  // `connect()` takes care of the `/{formId}` suffix that Kit v3 requires on
  // every field name
  const form = createForm(
    await connect<Model>(createPost, {
      ...defaults,
      ...initialData,
    })
  );
</script>

<BasicForm {form} novalidate />
