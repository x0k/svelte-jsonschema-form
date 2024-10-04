<script lang="ts">
  import { getFormContext } from "../context";
  import { getSimpleSchemaType } from "../schema";
  import { getComponent } from "../component";

  import type { FieldProps } from "./model";
  import { getErrors } from '../utils';

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
