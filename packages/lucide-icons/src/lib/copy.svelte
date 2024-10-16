<script lang="ts">
  import Copy, { type CopyProps } from 'lucide-svelte/icons/copy'

  const props: CopyProps = $props();
</script>

<Copy {...props} />
