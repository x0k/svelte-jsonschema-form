import{p as s}from"./package.C7bNT9Se.js";import{m as o,o as p}from"./advanced-examples.DhE6FVB3.js";import"./each.x-pIOehG.js";import"./render.CLv5-x32.js";import"./definitions.Da0aVzx7.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.D2KOTaHT.js";import"./shared.BB2D0wjN.js";import"./preload-helper.BUFao3bW.js";import"./buttons.Dh7YWdFA.js";/* empty css                                                       *//* empty css                                                                 */const h={package:o(p(s),{dependencies:{"@picocss/pico":"^2.1.0"}}),formDefaults:{theme:"basic"},files:{"src/routes/+layout.svelte":`<script lang="ts">
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
