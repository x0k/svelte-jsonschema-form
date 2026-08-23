<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";

  import { connect } from "$lib/rf/client/index.js";
  import { createFormIdBuilder } from "$lib/rf/index.js";

  import * as defaults from "../../form-defaults.js";
  import { createPost, loadInitialData } from "../data.remote.js";

  const initialData = await loadInitialData();

  // https://github.com/sveltejs/kit/pull/15657#issue-4208847537
  createPost.enhance(async ({ submit }) => {
    if (await submit()) {
      form.reset();
    }
  });

  const form = createForm(
    await connect(createPost, {
      ...defaults,
      ...initialData,
      idBuilder: createFormIdBuilder,
    })
  );
</script>

<BasicForm {form} novalidate />
