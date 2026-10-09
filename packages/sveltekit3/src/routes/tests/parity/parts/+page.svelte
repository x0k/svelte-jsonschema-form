<script lang="ts">
  import { BasicForm, createForm, validate } from "@sjsf/form";

  import { connect } from "#lib/rf/client/index.js";

  import * as defaults from "../../../remote-defaults.js";
  import { createPost, loadInitialData } from "../data.remote.js";

  const initialData = await loadInitialData();

  // JS on: `connect()` copies the visible form's parts into a hidden form
  // submitted through Kit's remote machinery.
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
