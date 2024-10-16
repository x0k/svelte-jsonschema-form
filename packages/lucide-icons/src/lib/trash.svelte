<script lang="ts">
  import Trash, { type TrashProps } from 'lucide-svelte/icons/trash'

  const props: TrashProps = $props();
</script>

<Trash {...props} />
