<script lang="ts">
  import { createForm } from "@sjsf/form";

  import { connect } from "#lib/rf/client/index.js";

  import * as defaults from "../../../remote-defaults.js";
  import { createPost, loadInitialData } from "../data.remote.js";
  import Form from "./form.svelte";

  const initialData = await loadInitialData();

  // Path B: JavaScript off. `connect()` is used only for the schema, the
  // id builder that appends the `/{formId}` suffix, and the form attributes —
  // the form below posts natively and never goes through its `onSubmit`.
  const connected = await connect(createPost, {
    ...defaults,
    ...initialData,
  });

  // NOTE: We can't set context here because of `await`
  const form = createForm(connected);
</script>

<Form {form} />
