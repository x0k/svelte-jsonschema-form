<script lang="ts">
  import {
    Content,
    setFormContext,
    SubmitButton,
    type FormState,
  } from "@sjsf/form";

  import { createPost } from "./data.remote.js";

  const { form }: { form: FormState<any> } = $props();

  setFormContext(form);
</script>

<form
  novalidate
  method={createPost.method}
  action={createPost.action}
  enctype="multipart/form-data"
>
  <Content />
  <SubmitButton />
</form>
