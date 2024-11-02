<script lang="ts" generics="T">
  import { type Schema, type UiSchemaRoot, FormContent, SubmitButton } from '@sjsf/form'

  import { useCustomForm } from '@/components/custom-form'

  interface Props {
    schema: Schema
    uiSchema?: UiSchemaRoot
    initialValue?: T
    onSubmit?: (value: T | undefined) => void
  }

  const { schema, uiSchema, initialValue, onSubmit }: Props = $props()

  const form = useCustomForm({
    schema,
    uiSchema,
    initialValue,
    onSubmit,
  })
</script>

<form use:form.enhance style="display: flex; flex-direction: column; gap: 1rem">
  <FormContent bind:value={form.formValue} />
  <SubmitButton />
</form>
