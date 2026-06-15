<script lang="ts">
  import { BasicForm, createForm, type FormOptions } from "@sjsf/form";
  import { Willow } from "@svar-ui/svelte-core";

  import "../src/lib/extra-widgets/checkboxes-include.js";

  const props: FormOptions<any> = $props();

  const form = createForm(props);
</script>

<Willow>
  <BasicForm {form} />
</Willow>
