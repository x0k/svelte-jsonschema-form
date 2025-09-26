<script lang="ts">
  import type { Snippet } from "svelte";
  import { fromRecord } from "@sjsf/form/lib/resolver";
  import { SimpleForm } from "@sjsf/form";

  import * as defaults from "@/lib/form/defaults";

  const { children }: { children: Snippet } = $props();
</script>

<SimpleForm
  {...defaults}
  schema={{
    title: "With icons",
    type: "null",
  }}
  icons={fromRecord({
    submit: children,
  })}
/>
