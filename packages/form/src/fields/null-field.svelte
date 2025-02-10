<script lang="ts">
  import { getComponent, getFormContext, NO_ERRORS } from "@/form/index.js";

  import type { FieldProps } from "./fields.js";

  let { value = $bindable(), config }: FieldProps<"null"> = $props();

  $effect(() => {
    if (value === undefined) {
      value = null;
    }
  });

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
</script>

<Template errors={NO_ERRORS} showTitle {value} {config}>
  {null}
</Template>
