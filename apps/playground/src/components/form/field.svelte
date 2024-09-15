<script lang="ts" generics="T" >
  import type { FieldProps } from './model';

  const { value = $bindable() }: FieldProps<T> = $props();
</script>

<div>
  Field
</div>