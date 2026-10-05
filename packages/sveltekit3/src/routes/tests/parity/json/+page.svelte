<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";

  import { connect } from "#lib/rf/client/index.js";

  import * as defaults from "../../../remote-defaults.js";
  import { createPost, loadInitialData } from "../data.remote.js";

  const initialData = await loadInitialData();

  // JS on: `connect()` sends the state as JSON chunks through a hidden form.
  const form = createForm(
    await connect(createPost, {
      ...defaults,
      ...initialData,
    })
  );
</script>

<BasicForm novalidate enctype="multipart/form-data" {form} />
