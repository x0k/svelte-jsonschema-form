import{p as s}from"./package.31Gz1Gbw.js";import{m as o,o as p}from"./advanced-examples.B6Tj_bEs.js";import"./each.BSZzvnKu.js";import"./render.ZeYcUU_y.js";import"./definitions.DpSYVT72.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.CUh4FENm.js";import"./shared.CGxYLIUR.js";import"./preload-helper.BUFao3bW.js";import"./buttons.CxaiFb6R.js";/* empty css                                                       *//* empty css                                                                 */const h={package:o(p(s),{dependencies:{"@picocss/pico":"^2.1.0"}}),formDefaults:{theme:"basic"},files:{"src/routes/+layout.svelte":`<script lang="ts">
  import type { Snippet } from 'svelte';

  import '@picocss/pico/css/pico.css';
  import '@sjsf/basic-theme/css/pico.css';

  const { children }: { children: Snippet } = $props()
<\/script>

{@render children()}

<style>
  :global(html) {
    padding: 2rem;
  }
</style>
`}};export{h as layer};
