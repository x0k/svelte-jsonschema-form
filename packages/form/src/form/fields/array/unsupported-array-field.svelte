<script lang="ts">
  import { getComponent } from "../../component.js";
  import { getFormContext } from "../../context.js";

  import type { FieldProps } from "../model.js";

  import { getArrayContext } from "./context.js";

  const { config, value: _ = $bindable() }: FieldProps<"unsupportedArray"> = $props();

  const ctx = getFormContext();
  const arrayCtx = getArrayContext();

  const Alert = $derived(getComponent(ctx, "alert", config));
</script>

<Alert
  {config}
  errors={arrayCtx.errors}
  type="error"
  title={ctx.translation("array-schema-missing-items")}
>
  {JSON.stringify(config, null, 2)}
</Alert>
