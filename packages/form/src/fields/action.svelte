<script lang="ts" generics="T">
  import type {
    Config,
    FieldAction,
    FormState,
    SchemaValue,
  } from "@/form/index.js";

  let {
    ctx,
    value = $bindable(),
    action,
    config,
  }: {
    ctx: FormState<T>;
    config: Config;
    value: SchemaValue | undefined;
    action: FieldAction;
  } = $props();
</script>

{@render action(ctx, config, {
  get current() {
    return value;
  },
  set current(v) {
    value = v;
  },
})}
