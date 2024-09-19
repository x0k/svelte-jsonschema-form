<script lang="ts" generics="T">
  import { getFormContext } from "../context";
  import { getSimpleSchemaType } from "../schema";
  import { getComponent } from "../utils";

  import type { CommonProps } from "./model";

  const ctx = getFormContext();

  const { value = $bindable(), schema, uiSchema }: CommonProps<T> = $props();

  const Layout = $derived(getComponent(ctx, "layout", uiSchema));
  const schemaType = $derived(getSimpleSchemaType(schema));
</script>

<Layout type="root-field">
  Field
</Layout>
