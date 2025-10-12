<script lang="ts">
  import { tick } from "svelte";
  import { BasicForm, createForm } from "@sjsf/form";
  // WARN: You must export this ID Builder in your `defaults` file
  import { createFormIdBuilder } from "@sjsf/sveltekit/rf";
  import { connect } from "@sjsf/sveltekit/rf/client";

  import * as defaults from "$lib/form-defaults";

  import { createPost, getInitialData } from "./data.remote";

  const initialData = await getInitialData();

  const form = createForm(
    await connect(
      createPost.enhance(async ({ submit }) => {
        await submit();
        // @ts-expect-error https://github.com/sveltejs/kit/issues/14687
        if (createPost.fields.allIssues()) {
          return;
        }
        console.log(createPost.result);
        // Waiting for an update from remote function
        await tick();
        form.reset();
      }),
      {
        ...defaults,
        ...initialData,
        idBuilder: createFormIdBuilder,
        // Required due to the use of `enhance`
        fields: createPost.fields,
      }
    )
  );
</script>

<BasicForm {form} novalidate />
