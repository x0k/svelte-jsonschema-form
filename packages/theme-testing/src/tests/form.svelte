<script lang="ts">
  import {
    Content,
    createForm,
    setFormContext,
    type FormOptions,
  } from "@sjsf/form";

  const props: FormOptions<any> = $props();

  const form = createForm(props);
  setFormContext(form);
</script>

<Content />
