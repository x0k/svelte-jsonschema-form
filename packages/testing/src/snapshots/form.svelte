<script lang="ts">
  import {
    Content,
    createForm,
    setFormContext2,
    type FormOptions,
    type Validator,
  } from "@sjsf/form";

  const props: FormOptions<any, Validator> = $props();

  const form = createForm(props);
  setFormContext2(form);
</script>

<Content />
