<script lang="ts">
  import { BasicForm, createForm, validate } from "@sjsf/form";

  import { connect } from "#lib/rf/client/index.js";

  import * as defaults from "../../remote-defaults.js";
  import { createPost, loadInitialData } from "../data.remote.js";

  const initialData = await loadInitialData();

  // Deliberately no `enhance` callback, unlike every sibling route: this is
  // the path where Kit's default fallback drives the submission. Mirrors
  // `legacy/sveltekit`'s `/tests/connect`.
  const connected = await connect(createPost, {
    ...defaults,
    ...initialData,
  });
  const form = createForm(connected);
</script>

<BasicForm
  novalidate
  enctype="multipart/form-data"
  action={createPost.action}
  method={createPost.method}
  {form}
  onsubmit={(e) => {
    e.preventDefault();
    void validate(form, {
      onValid: (value) => connected.submit(value, e),
    });
  }}
/>
