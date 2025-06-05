<script lang="ts">
  import lz from "lz-string";
  import { PLAYGROUND_LINK } from "@/i18n";

  import Buttons from "./buttons.svelte";

  const samples = import.meta.glob("apps/playground2/src/samples/*.ts", {
    eager: false,
    import: "default",
  });
</script>

<Buttons
  items={Object.keys(samples)}
  onClick={async (key) => {
    const sample = await samples[key]();
    window.open(
      `${PLAYGROUND_LINK}#${lz.compressToEncodedURIComponent(JSON.stringify(sample))}`
    );
  }}
  label={(key) => key.substring(27, key.length - 3)}
/>
