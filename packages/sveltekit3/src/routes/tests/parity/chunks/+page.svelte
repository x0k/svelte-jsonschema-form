<script lang="ts">
  import { BasicForm, createForm, validate } from "@sjsf/form";

  import { connect } from "#lib/rf/client/index.js";

  import * as defaults from "../../../remote-defaults.js";
  import { createPost, loadInitialData } from "../data.remote.js";

  const initialData = await loadInitialData();

  // JS on with `useJsonChunks`: `connect()` sends the state as
  // `JSON.stringify` chunks, and the server reads them with `JSON.parse` and
  // a reviver — the same wire the pre-FormData path used.
  const connected = await connect(createPost, {
    ...defaults,
    ...initialData,
    useJsonChunks: true,
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
