<script lang="ts" module>
  import type { Ref } from "@/lib/svelte.svelte.js";
  import type { Config, SchemaValue } from "@/form/index.js";

  declare module "../../form/index.js" {
    interface FieldActionTypes {
      clearEdit: {};
    }
  }

  export { clearEdit };
</script>

{#snippet clearEdit(config: Config, valueRef: Ref<SchemaValue | undefined>)}
  aaa
{/snippet}
