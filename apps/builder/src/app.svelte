<script lang="ts">
  import {
    Controls,
    Builder,
    BuilderContext,
    setBuilderContext,
    Settings,
  } from "./builder/index.js";

  setBuilderContext(new BuilderContext());
</script>

<div
  class="grid grid-cols-[1fr_4fr_2fr] grid-rows-[auto_1fr] h-screen py-4 px-8 gap-4 max-w-[80rem] mx-auto"
>
  <div class="col-span-3">Form builder</div>
  <div>
    <Controls />
  </div>
  <div>
    <Builder />
  </div>
  <div>
    <Settings />
  </div>
</div>
