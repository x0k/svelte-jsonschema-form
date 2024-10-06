<script lang="ts">
  import { getComponent } from "../../component";
  import { getFormContext } from "../../context";

  import type { FieldProps } from "../model";

  import { getArrayContext } from "./context";

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
