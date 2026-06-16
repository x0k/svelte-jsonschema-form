<script lang="ts">
  import { getFormContext, getValueSnapshot } from "@sjsf/form";

  const form = getFormContext();
  const value = $derived(JSON.stringify(getValueSnapshot(form)));
</script>

<output data-testid="form-value">{value}</output>
