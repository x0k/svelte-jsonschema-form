<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";

  import { connect } from "#lib/rf/client/index.js";

  import * as defaults from "../../remote-defaults.js";
  import { createPost, loadInitialData } from "../data.remote.js";

  const initialData = await loadInitialData();

  // Deliberately no `enhance` callback, unlike every sibling route: this is
  // the path where Kit's default fallback drives the submission. Mirrors
  // `legacy/sveltekit`'s `/tests/connect`.
  const form = createForm(
    await connect(createPost, {
      ...defaults,
      ...initialData,
    })
  );
</script>

<BasicForm novalidate enctype="multipart/form-data" {form} />
