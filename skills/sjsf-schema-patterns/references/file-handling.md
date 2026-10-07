# SJSF File Handling Reference

SJSF supports two approaches for handling file uploads:

## 1. Data URL (Base64 Encoded Strings)

Native schema format `data-url` converts uploaded files into base64 data URIs
(requires the `compat` resolver):

```json
{
  "type": "object",
  "properties": {
    "avatar": {
      "type": "string",
      "format": "data-url",
      "title": "Avatar Image"
    },
    "attachments": {
      "type": "array",
      "title": "Documents",
      "items": {
        "type": "string",
        "format": "data-url"
      }
    }
  }
}
```

### UI Schema for Data URL

`accept` lives in the namespaced file attribute bag:

```ts
const uiSchema = {
  avatar: {
    "ui:options": {
      file: {
        accept: "image/png, image/jpeg",
      },
    },
  },
};
```

---

## 2. Native File / FileList (Multipart Uploads)

`native-file` / `native-files` fields hold `File` / `File[]` directly.
Set `enctype="multipart/form-data"` on the form.

### File Validation

Custom Ajv keyword on `File` instances (see `custom-keyword` demo).
Augment `Schema` first, keep factory options plumbing
(`ValidatorFactoryOptions`: `schema`, `uiSchema`, `uiOptionsRegistry`, `merger`):

```ts
import { addFormComponents, createFormValidator } from "@sjsf/ajv8-validator";
import type { ValidatorFactoryOptions } from "@sjsf/form";
import type { Ajv } from "ajv";

declare module "@sjsf/form" {
  interface Schema {
    maxSizeBytes?: number;
  }
}

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
  });
  return ajv;
}

// Export a Creatable that preserves per-form factory options
// (don't bake in an empty schema context with a plain instance):
export const validator = (options: ValidatorFactoryOptions) =>
  createFormValidator({
    ...options,
    ajvPlugins: (ajv) => addKeywords(addFormComponents(ajv)),
  });
```

Alternative for `FileList`: `maxFileSizeBytes` UI option with
`createFileSizeValidator` from `@sjsf/form/validators/file-size`.
