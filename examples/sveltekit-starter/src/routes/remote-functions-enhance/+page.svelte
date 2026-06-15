<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  import { connect } from "@sjsf/sveltekit/rf/client";

  import * as defaults from "$lib/sjsf/remote-defaults";

  import { createPost, getInitialData } from "./data.remote";

  const initialData = await getInitialData();

  const form = createForm(
    await connect(
      createPost.enhance(async ({ submit }) => {
        if (await submit()) {
          console.log(createPost.result);
          form.reset();
        }
      }),
      {
        ...defaults,
        ...initialData,
        // Required due to the use of `enhance`
        fields: createPost.fields,
      }
    )
  );
</script>

<BasicForm {form} novalidate />
