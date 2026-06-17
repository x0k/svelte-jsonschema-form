<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";

  import { connect } from "$lib/rf/client/index.js";
  import { createFormIdBuilder } from "$lib/rf/index.js";

  import * as defaults from "../../form-defaults.js";
  import { createPost, getInitialData } from "./data.remote.js";

  const initialData = await getInitialData();

  const enhanced = createPost.enhance(async ({ submit }) => {
    if (await submit()) {
      form.reset();
    }
  });

  const form = createForm(
    await connect(enhanced, {
      ...defaults,
      ...initialData,
      idBuilder: createFormIdBuilder,
      fields: createPost.fields,
    })
  );
</script>

<BasicForm {form} novalidate />
