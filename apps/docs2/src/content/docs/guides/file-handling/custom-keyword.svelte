<script lang="ts" module>
  declare module "@sjsf/form" {
    interface Schema {
      maxSizeBytes?: number;
    }
  }
</script>

<script lang="ts">
  import { type Ajv } from "ajv";
  import { BasicForm, createForm, ON_CHANGE } from "@sjsf/form";
  import { formatFileSize } from "@sjsf/form/validators/file-size";
  import { addFormComponents } from "@sjsf/ajv8-validator";

  import * as defaults from "@/lib/form/defaults";

  function addKeywords(ajv: Ajv): Ajv {
    ajv.addKeyword({
      keyword: "maxSizeBytes",
      validate(max: number, data: unknown) {
        if (data === undefined) {
          return true;
        }
        if (!(data instanceof File)) {
          throw new Error(`Expected "File", but got "${typeof data}"`);
        }
        return data.size <= max;
      },
      error: {
        message: (ctx) => `Max file size ${formatFileSize(ctx.schema)}`,
      },
    });
    return ajv;
  }

  const form = createForm({
    ...defaults,
    validator: (options) =>
      defaults.validator({
        ...options,
        ajvPlugins: (ajv) => addKeywords(addFormComponents(ajv)),
      }),
    schema: {
      title: "File",
      maxSizeBytes: 1024 * 4,
    },
    uiSchema: {
      "ui:components": {
        unknownField: "nativeFileFieldWrapper",
      },
    },
    fieldsValidationMode: ON_CHANGE,
  });
</script>

<BasicForm {form} />
