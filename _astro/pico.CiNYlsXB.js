import{p as s}from"./package.31Gz1Gbw.js";import{m as o,o as p}from"./advanced-examples.D29mA0nE.js";import"./each.C-hpqtOp.js";import"./render.CeWjb92l.js";import"./definitions.BMjtFZls.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.BdOHPHmx.js";import"./shared.D-CM3LYn.js";import"./preload-helper.BUFao3bW.js";import"./buttons.CiWFKXVr.js";/* empty css                                                       *//* empty css                                                                 */const h={package:o(p(s),{dependencies:{"@picocss/pico":"^2.1.0"}}),formDefaults:{theme:"basic"},files:{"src/routes/+layout.svelte":`<script lang="ts">
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
