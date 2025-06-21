<script lang="ts" module>
  import type { FieldCommonProps } from "@sjsf/form";

  declare module "@sjsf/form" {
    interface FoundationalComponents {
      hiddenField: {};
    }
    interface ComponentProps {
      hiddenField: FieldCommonProps<string | number | boolean | null>;
    }
    interface ComponentBindings {
      hiddenField: "value";
    }
  }
</script>

<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";
  const { config, value = $bindable() }: ComponentProps["hiddenField"] =
    $props();
</script>

<input id={config.id} name={config.id} type="hidden" {value} />
