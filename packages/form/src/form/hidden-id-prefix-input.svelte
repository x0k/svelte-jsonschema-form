<script lang="ts">
  import { FORM_ID_BUILDER, FORM_ID_PREFIX } from "./internals.js";
  import type { FormState } from "./state/index.js";

  const {
    form,
    name = form[FORM_ID_BUILDER].idPrefixName(),
  }: { form: FormState<any>; name?: string } = $props();
</script>

<input {name} type="hidden" value={form[FORM_ID_PREFIX]} />
