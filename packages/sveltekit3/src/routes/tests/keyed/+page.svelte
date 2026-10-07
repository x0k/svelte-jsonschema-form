<script lang="ts">
  import { BasicForm, createForm, reset } from "@sjsf/form";

  import { connect } from "#lib/rf/client/index.js";

  import * as defaults from "../../remote-defaults.js";
  import { createPost, loadInitialData } from "../data.remote.js";

  const initialData = await loadInitialData();

  // Kit appends `/{key}` to the action id, which `connect()` has to strip again
  // when it builds the `/{formId}` suffix every field name must end with.
  // `for(...)` goes through the server-side proxy, so it has to be called per
  // request rather than at the top level of `data.remote.ts`.
  const createKeyedPost = createPost.for("my-key");

  createKeyedPost.enhance(async ({ submit }) => {
    if (await submit()) {
      reset(form);
    }
  });

  const form = createForm(
    await connect(createKeyedPost, {
      ...defaults,
      ...initialData,
    })
  );
</script>

<BasicForm novalidate enctype="multipart/form-data" {form} />
