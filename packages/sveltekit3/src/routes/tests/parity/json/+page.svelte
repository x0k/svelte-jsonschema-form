<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";

  import { connect } from "#lib/rf/client/index.js";

  import * as defaults from "../../../remote-defaults.js";
  import { createPost, loadInitialData } from "../data.remote.js";

  const initialData = await loadInitialData();

  // JS on: `connect()` copies the visible form's parts into a hidden form
  // submitted through Kit's remote machinery.
  const form = createForm(
    await connect(createPost, {
      ...defaults,
      ...initialData,
    })
  );
</script>

<BasicForm novalidate enctype="multipart/form-data" {form} />
