<script lang="ts">
  import { BasicForm, createForm, reset, validate } from "@sjsf/form";

  import { connect } from "#lib/rf/client/index.js";

  import * as defaults from "../../remote-defaults.js";
  import { createPost, loadInitialData } from "../data.remote.js";

  const initialData = await loadInitialData();

  // https://github.com/sveltejs/kit/pull/15657#issue-4208847537
  createPost.enhance(async ({ submit }) => {
    if (await submit()) {
      reset(form);
    }
  });

  const connected = await connect(createPost, {
    ...defaults,
    ...initialData,
  });
  const form = createForm(connected);
</script>

<BasicForm
  novalidate
  enctype="multipart/form-data"
  action={createPost.action}
  method={createPost.method}
  {form}
  onsubmit={(e) => {
    e.preventDefault();
    void validate(form, {
      onValid: (value) => connected.submit(value, e),
    });
  }}
/>
