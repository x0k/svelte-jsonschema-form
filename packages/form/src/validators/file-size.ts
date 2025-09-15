import {
  resolveUiOption,
  type AsyncFileListValidator,
  type UiOptionsRegistry,
  type UiSchemaRoot,
} from "@/form/main.js";

declare module "../form/index.js" {
  interface UiOptions {
    maxFileSizeBytes?: number;
  }
}

export interface FileSizeErrorOptions {
  file: File;
  maxSizeBytes: number;
}

export type FileSizeValidatorOptions = {
  uiSchema?: UiSchemaRoot;
  uiOptionsRegistry?: UiOptionsRegistry;
};

export function createFileSizeValidator(
  error: (options: FileSizeErrorOptions) => string,
  {
    uiSchema: uiSchemaRoot = {},
    uiOptionsRegistry = {},
  }: FileSizeValidatorOptions = {}
): AsyncFileListValidator {
  return {
    validateFileListAsync(_, fileList, config) {
      const errors: string[] = [];
      const maxSizeBytes = resolveUiOption(
        uiSchemaRoot,
        uiOptionsRegistry,
        config.uiSchema,
        "maxFileSizeBytes"
      );
      if (maxSizeBytes !== undefined) {
        for (const file of Array.from(fileList)) {
          if (file.size > maxSizeBytes) {
            errors.push(
              error({
                file,
                maxSizeBytes,
              })
            );
          }
        }
      }
      return Promise.resolve(errors);
    },
  };
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 ** 2) return (bytes / 1024).toFixed(2) + " KB";
  if (bytes < 1024 ** 3) return (bytes / 1024 ** 2).toFixed(2) + " MB";
  return (bytes / 1024 ** 3).toFixed(2) + " GB";
}
