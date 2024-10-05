<script lang="ts">
  import { getSimpleSchemaType } from "@/core";

  import { getFormContext } from "../context";
  import { getComponent } from "../component";
  import { getErrors } from '../utils';

  import type { FieldProps } from "./model";

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
