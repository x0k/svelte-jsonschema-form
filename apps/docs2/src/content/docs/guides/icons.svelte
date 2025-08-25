<script lang="ts">
  import type { Snippet } from "svelte";
  import { SimpleForm } from "@sjsf/form";
  import { fromRecord } from "@sjsf/form/lib/resolver";

  import * as defaults from "@/lib/form/defaults";

  const { children }: { children: Snippet } = $props();
</script>

<SimpleForm
  {...defaults}
  schema={{
    title: "With icons",
  }}
  icons={fromRecord({
    submit: children,
  })}
/>
