<script lang="ts">
  import { createForm } from "@sjsf/form";

  import { connect } from "$lib/rf/client/index.js";
  import { createFormIdBuilder } from "$lib/rf/index.js";

  import * as defaults from "../../form-defaults.js";
  import { createPost, getInitialData } from "./data.remote.js";
  import Form from "./form.svelte";

  const initialData = await getInitialData();

  const connected = await connect(createPost, {
    ...defaults,
    ...initialData,
    idBuilder: createFormIdBuilder,
  });

  // NOTE: We can't set context here because of `await`
  const form = createForm(connected);
</script>

<Form {form} />
