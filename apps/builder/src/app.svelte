<script lang="ts">
  import { setThemeContext } from "@sjsf/shadcn4-theme";

  import { Button } from "$lib/components/ui/button/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
  } from "$lib/components/ui/select/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";

  import {
    Controls,
    Builder,
    BuilderContext,
    setBuilderContext,
    Settings,
  } from "./builder/index.js";

  const ctx = new BuilderContext();
  setBuilderContext(ctx);
  setThemeContext({
    components: {
      Button,
      Checkbox,
      Input,
      Label,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      Textarea,
    },
  });
</script>

<div class="min-h-screen bg-background" style="--header-height: 60px;">
  <div class="sticky top-0 z-50 bg-background">
    <div class="mx-auto px-8 py-4">
      <h1 class="text-xl font-bold">Form Builder</h1>
    </div>
  </div>

  <div class="mx-auto px-8">
    <div class="grid grid-cols-[1fr_5fr_2fr] gap-4">
      <div
        class="sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] overflow-y-auto py-4"
      >
        <Controls />
      </div>

      <div class="p-4">
        <Builder />
      </div>

      <div
        class="sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] overflow-y-auto py-4"
      >
        <Settings />
      </div>
    </div>
  </div>
</div>
