<script lang="ts">
  import { BasicForm, createForm, validate } from "@sjsf/form";
  import { connect } from "@sjsf/sveltekit3/rf/client";

  import type { Model } from "#lib/post.js";
  import * as defaults from "#lib/sjsf/remote-defaults.js";

  import { createPost, getInitialData } from "./data.remote.js";

  const initialData = await getInitialData();

  // `connect()` takes care of the `/{formId}` suffix that Kit v3 requires on
  // every field name
  const connected = await connect<Model>(createPost, {
    ...defaults,
    ...initialData,
  });
  const form = createForm(connected);
</script>

<BasicForm
  {form}
  novalidate
  action={createPost.action}
  method={createPost.method}
  onsubmit={(e) => {
    e.preventDefault();
    void validate(form, {
      onValid: (value) => connected.submit(value, e),
    });
  }}
/>
