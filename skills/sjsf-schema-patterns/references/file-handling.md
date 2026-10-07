# SJSF File Handling Reference

SJSF supports two approaches for handling file uploads:

## 1. Data URL (Base64 Encoded Strings)

Native schema format `data-url` converts uploaded files directly into base64 data URIs:

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
Specify accepted file types via `ui:options`:
```ts
const uiSchema = {
  avatar: {
    "ui:options": {
      accept: "image/png, image/jpeg",
    }
  }
};
```

---

## 2. Native File / FileList (Multipart Uploads)

When files should not be base64-encoded in the client (e.g. large files or SvelteKit form actions using `FormData`):

1. Define a string or object property in schema.
2. In SvelteKit, `<SvelteKitForm>` sends standard multipart `FormData`.
3. In custom widgets, bind `<input type="file" />` directly and attach the `File` or `FileList` object.

### File Validation (Custom Keyword with Ajv)
```ts
import { createFormValidator } from "@sjsf/ajv8-validator";

export const validator = createFormValidator({
  ajvPlugins: [
    (ajv) => {
      ajv.addKeyword({
        keyword: "maxFileSize",
        type: "string",
        validate: (maxBytes: number, data: string) => {
          // Calculate approx base64 decoded size
          const size = (data.length * 3) / 4;
          return size <= maxBytes;
        },
        error: { message: "File exceeds maximum permitted size" }
      });
    }
  ]
});
```
