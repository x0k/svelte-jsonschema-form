<script>
  import { BasicForm, createForm } from "@sjsf/form";

  import * as defaults from "@/lib/form/defaults";
  import {
    createFileSizeValidator,
    formatFileSize,
  } from "@sjsf/form/validators/file-size";

  const form = createForm({
    ...defaults,
    createValidator: (options) =>
      Object.assign(
        defaults.createValidator(options),
        createFileSizeValidator(
          ({ file, maxSizeBytes }) =>
            `File ${file.name} is too large, max file size ${formatFileSize(maxSizeBytes)}`,
          options
        )
      ),
    schema: {
      type: "string",
      title: "File",
      format: "data-url",
    },
    uiSchema: {
      "ui:components": {
        stringField: "fileField",
      },
      "ui:options": {
        maxFileSizeBytes: 1024 * 4,
      },
    },
  });
</script>

<BasicForm {form} />
