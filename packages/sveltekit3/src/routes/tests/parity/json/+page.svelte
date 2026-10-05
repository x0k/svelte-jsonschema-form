<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";

  import { connect } from "#lib/rf/client/index.js";

  import * as defaults from "../../../remote-defaults.js";
  import { createPost, loadInitialData } from "../data.remote.js";

  const initialData = await loadInitialData();

  // Path A: JavaScript on. `connect()` serializes the state as JSON into hidden
  // inputs and submits them through a second, hidden form.
  const form = createForm(
    await connect(createPost, {
      ...defaults,
      ...initialData,
    })
  );
</script>

<BasicForm novalidate enctype="multipart/form-data" {form} />
