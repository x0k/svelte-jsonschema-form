<script lang="ts">
  import { BasicForm, createForm, validate } from "@sjsf/form";
  import { resolver } from "@sjsf/form/resolvers/compat";

  import { connect } from "#lib/rf/client/index.js";

  import { schema, uiSchema } from "../model.js";
  import * as defaults from "../remote-defaults.js";
  import { createPost } from "./data.remote.js";

  const connected = await connect(createPost, {
    ...defaults,
    resolver,
    schema,
    uiSchema,
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
