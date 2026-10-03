<script lang="ts">
  import { resolveIdPrefixName } from "./id.js";
  import { FORM_ID_BUILDER, FORM_ID_PREFIX } from "./internals.js";
  import type { FormState } from "./state/index.js";

  const {
    form,
    name = resolveIdPrefixName(form[FORM_ID_BUILDER]),
  }: { form: FormState<any>; name?: string } = $props();
</script>

<input {name} type="hidden" value={form[FORM_ID_PREFIX]} />
