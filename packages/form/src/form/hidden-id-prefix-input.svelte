<script lang="ts">
  import { SJSF_ID_PREFIX } from "./id.js";
  import { FORM_ID_FROM_PATH, FORM_ROOT_PATH } from "./internals.js";
  import type { FormState } from "./state/index.js";

  const {
    form,
    name = SJSF_ID_PREFIX,
  }: { form: FormState<any>; name?: string } = $props();
</script>

<input
  {name}
  type="hidden"
  value={form[FORM_ID_FROM_PATH](form[FORM_ROOT_PATH])}
/>
