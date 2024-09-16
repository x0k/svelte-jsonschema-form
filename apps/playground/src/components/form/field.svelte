<script lang="ts" generics="T" >
  import { pickSchemaType, typeOfSchema } from '@/lib/schema';
  import type { FieldProps } from './model';

  const { value = $bindable(), schema }: FieldProps<T> = $props();
  const schemaType = $derived(typeOfSchema(schema))
  const simpleSchemaType = $derived(Array.isArray(schemaType) ? pickSchemaType(schemaType) : schemaType)
</script>

<div>
  Field
</div>
