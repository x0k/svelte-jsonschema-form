<script lang="ts">
  import { getSimpleSchemaType } from "@/core/schema/index.js";

  import { getFormContext } from "../context.js";
  import { getComponent } from "../component.js";
  import { getErrors } from '../utils.js';

  import type { FieldProps } from "./model.js";

  const ctx = getFormContext();

  const { value: _ = $bindable(), config }: FieldProps<"unsupported"> =
    $props();

  const Alert = $derived(getComponent(ctx, "alert", config));
  const errors = $derived(getErrors(ctx, config.idSchema));
</script>

<Alert
  errors={errors}
  type="error"
  title={ctx.translation(
    "unsupported-field-type",
    getSimpleSchemaType(config.schema)
  )}
  {config}
>
  {JSON.stringify(config, null, 2)}
</Alert>
