<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  import { resolver } from "@sjsf/form/resolvers/compat";

  import { connect } from "#lib/rf/client/index.js";

  import { schema, uiSchema } from "../model.js";
  import * as defaults from "../remote-defaults.js";
  import { createPost } from "./data.remote.js";

  const form = createForm(
    await connect(createPost, {
      ...defaults,
      resolver,
      schema,
      uiSchema,
    })
  );
</script>

<BasicForm novalidate enctype="multipart/form-data" {form} />
