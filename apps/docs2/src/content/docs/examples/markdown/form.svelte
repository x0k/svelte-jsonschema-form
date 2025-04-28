<script lang="ts">
  import { overrideByRecord } from "@sjsf/form/lib/resolver";
  import type { Schema } from "@sjsf/form";

  import MyForm from "@/components/my-form.svelte";
  import { theme as defaultTheme } from "@/components/form-defaults";

  import Description from "./description.svelte";

  const schema: Schema = {
    type: "null",
    title: "Title",
    description: "**bold** *italic* [link](#)",
  };

  const theme = overrideByRecord(defaultTheme, {
    description: Description,
  });
</script>

<MyForm {schema} {theme} />
