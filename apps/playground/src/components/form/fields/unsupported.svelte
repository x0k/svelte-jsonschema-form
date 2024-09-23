<script lang="ts">
  import { getFormContext } from "../context";
  import { getSimpleSchemaType } from "../schema";
  import { getComponent } from "../utils";

  import type { FieldProps } from "./model";

  const ctx = getFormContext();

  const {
    schema,
    uiSchema,
    value: _ = $bindable(),
  }: FieldProps<"unsupported"> = $props();

  const Alert = $derived(getComponent(ctx, "alert", uiSchema));
</script>

<Alert
  type="error"
  title={ctx.translation("unsupported-field-type", getSimpleSchemaType(schema))}
>
  {JSON.stringify(schema, null, 2)}
</Alert>
