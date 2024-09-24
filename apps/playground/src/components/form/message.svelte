<script lang="ts">
  const {
    message,
    value: _ = $bindable(),
    form: _2 = $bindable(),
  }: any = $props();
</script>

<p style="color: red;">{message}</p>
