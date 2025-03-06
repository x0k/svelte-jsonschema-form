<script lang="ts">
  import Ajv, { type AsyncSchema, type SchemaValidateFunction } from "ajv";
  import {
    addFormComponents,
    createAsyncFormValidator,
  } from "@sjsf/ajv8-validator";
  import { ON_INPUT, BasicForm } from "@sjsf/form";
  import { Status } from "@sjsf/form/lib/action.svelte";

  import { createMyForm } from "@/components/my-form";

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

  const form = createMyForm({
    validator: createAsyncFormValidator({ ajv }),
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
<BasicForm {form} novalidate />
