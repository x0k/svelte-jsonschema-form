<script lang="ts">
  import { getFormContext } from "../../context";
  import { getComponent } from "../../utils";

  import { getArrayContext } from "./context";

  const ctx = getFormContext();
  const arrayCtx = getArrayContext();

  const Alert = $derived(getComponent(ctx, "alert", arrayCtx.uiSchema));
</script>

<Alert type="error" title={ctx.translation("array-schema-missing-items")}>
  {JSON.stringify(arrayCtx.schema, null, 2)}
</Alert>
