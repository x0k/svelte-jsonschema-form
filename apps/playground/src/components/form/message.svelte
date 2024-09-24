<script lang="ts">
  const { message, value: _ = $bindable() }: any = $props();
</script>

<p style="color: red;">{message}</p>
