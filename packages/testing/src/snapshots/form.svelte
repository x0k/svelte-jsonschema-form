<script lang="ts">
  import {
    Content,
    createForm,
    setFormContext,
    type FormOptions,
    type Validator,
  } from "@sjsf/form";

  const props: FormOptions<any, Validator> = $props();

  const form = createForm(props);
  setFormContext(form.context);
</script>

<Content />
