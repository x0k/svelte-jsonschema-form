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
    },
  });

  let rootEl: HTMLDivElement;
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={rootEl}
  class="grid grid-cols-[1fr_5fr_2fr] px-2 grid-rows-[auto_1fr] h-screen max-w-[80rem] mx-auto overflow-hidden"
  onclick={(e) => {
    if (
      e.target === rootEl ||
      (e.target instanceof Node && e.target.parentElement === rootEl)
    ) {
      ctx.clearSelection();
    }
  }}
>
  <div class="col-span-3 px-2 py-4">Form builder</div>
  <div class="overflow-x-hidden overflow-y-auto p-2">
    <Controls />
  </div>
  <div class="overflow-x-hidden overflow-y-auto p-2">
    <Builder />
  </div>
  <div class="overflow-x-hidden overflow-y-auto p-2">
    <Settings />
  </div>
</div>
