<script lang="ts" generics="T" >
  import { getSimpleSchemaType } from '../schema';
  
  import type { FieldProps } from './model';

  const { value = $bindable(), schema }: FieldProps<T> = $props();
  const schemaType = $derived(getSimpleSchemaType(schema))
</script>

<div>
  Field
</div>
