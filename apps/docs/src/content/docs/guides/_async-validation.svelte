<script lang="ts">
  import Ajv, { type AsyncSchema, type SchemaValidateFunction } from "ajv";
  import {
    addFormComponents,
    createAsyncValidator,
  } from "@sjsf/ajv8-validator";
  import { ON_INPUT, RawForm } from "@sjsf/form";
  import { handleValidationProcessError } from "@sjsf/form/translations/en";
  import { Status } from "@sjsf/form/use-mutation.svelte";

  import { createCustomForm } from "@/components/custom-form";

  const ajv = addFormComponents(new Ajv());
  const validate: SchemaValidateFunction = async (schema, data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (Math.random() > 0.5) {
      throw new Error("async error");
    }
    return data.length >= schema.minimum && data.length <= schema.maximum;
  };
  ajv.addKeyword({
    keyword: "asyncLength",
    async: true,
    type: "string",
    validate,
  });

  const schema: AsyncSchema = {
    $async: true,
    type: "string",
    pattern: "^\\d+$",
    asyncLength: {
      minimum: 3,
      maximum: 7,
    },
  };

  const form = createCustomForm({
    validator: createAsyncValidator({ ajv }),
    handleValidationProcessError,
    schema: schema,
    fieldsValidationMode: ON_INPUT,
    onSubmit: console.log,
  });

  const statusNames: Record<Status, string> = {
    [Status.IDLE]: "idle",
    [Status.Processed]: "processed",
    [Status.Success]: "success",
    [Status.Failed]: "failed",
  };
</script>

form validation: {statusNames[form.validation.status]}, fields validation: {statusNames[
  form.fieldsValidation.status
]}
<RawForm {form} novalidate />
