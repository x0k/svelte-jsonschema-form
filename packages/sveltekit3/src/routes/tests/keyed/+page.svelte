<script lang="ts">
  import { BasicForm, createForm, reset, validate } from "@sjsf/form";

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

  const connected = await connect(createKeyedPost, {
    ...defaults,
    ...initialData,
  });
  const form = createForm(connected);
</script>

<BasicForm
  novalidate
  enctype="multipart/form-data"
  action={createKeyedPost.action}
  method={createKeyedPost.method}
  {form}
  onsubmit={(e) => {
    e.preventDefault();
    void validate(form, {
      onValid: (value) => connected.submit(value, e),
    });
  }}
/>
