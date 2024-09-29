<script lang="ts">
  import { getComponent } from "../../component";
  import { getFormContext } from "../../context";

  import { getArrayContext } from "./context";

  const ctx = getFormContext();
  const arrayCtx = getArrayContext();

  const Alert = $derived(getComponent(ctx, "alert", arrayCtx.config));
</script>

<Alert
  config={arrayCtx.config}
  type="error"
  title={ctx.translation("array-schema-missing-items")}
>
  {JSON.stringify(arrayCtx.config, null, 2)}
</Alert>
