import{p as s}from"./package.C7bNT9Se.js";import{m as o,o as p}from"./advanced-examples.B6Xjd8AW.js";import"./each.BC0dbH8N.js";import"./render.DxLQKmJN.js";import"./definitions.BbBg4IOf.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.BL4UIDmo.js";import"./shared.CV_bqTuc.js";import"./preload-helper.BUFao3bW.js";import"./buttons.DaY576ra.js";/* empty css                                                       *//* empty css                                                                 */const h={package:o(p(s),{dependencies:{"@picocss/pico":"^2.1.0"}}),formDefaults:{theme:"basic"},files:{"src/routes/+layout.svelte":`<script lang="ts">
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
