<script lang="ts">
  import { createForm } from "@sjsf/form";

  import { connect } from "#lib/rf/client/index.js";

  import * as defaults from "../../../remote-defaults.js";
  import { createPost, loadInitialData } from "../data.remote.js";
  import Form from "./form.svelte";

  const initialData = await loadInitialData();

  // JS off: `connect()` supplies only the schema, the `/{formId}` suffixing id
  // builder, and the form attributes. The form posts natively.
  const connected = await connect(createPost, {
    ...defaults,
    ...initialData,
  });

  // NOTE: We can't set context here because of `await`
  const form = createForm(connected);
</script>

<Form {form} />
