<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";

  import { connect } from "#lib/rf/client/index.js";

  import * as defaults from "../../../remote-defaults.js";
  import { createPost, loadInitialData } from "../data.remote.js";

  const initialData = await loadInitialData();

  // JS on with `useJsonChunks`: `connect()` sends the state as
  // `JSON.stringify` chunks, and the server reads them with `JSON.parse` and
  // a reviver — the same wire the pre-FormData path used.
  const form = createForm(
    await connect(createPost, {
      ...defaults,
      ...initialData,
      useJsonChunks: true,
    })
  );
</script>

<BasicForm novalidate enctype="multipart/form-data" {form} />
