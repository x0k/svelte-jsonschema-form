# SJSF Themes and Validators Reference

## Supported Themes Matrix

All themes are designed for Svelte 5 and export a `theme` object.

| Theme Package | Target CSS / UI Framework | Extra Widgets | Installation Command |
| :--- | :--- | :--- | :--- |
| `@sjsf/shadcn4-theme` | shadcn-svelte (Tailwind v4) | DatePicker, MultiSelect, Combobox | `pnpm add @sjsf/shadcn4-theme bits-ui clsx tailwind-merge` |
| `@sjsf/daisyui5-theme` | daisyUI v5 (Tailwind v4) | Range, Toggle, FileInput | `pnpm add @sjsf/daisyui5-theme daisyui` |
| `@sjsf/skeleton5-theme` | Skeleton v5 | Sliders, Switches, Modals | `pnpm add @sjsf/skeleton5-theme @skeletonlabs/skeleton` |
| `@sjsf/flowbite3-theme` | Flowbite Svelte v3 | Datepicker, Dropdowns | `pnpm add @sjsf/flowbite3-theme flowbite-svelte` |
| `@sjsf/basic-theme` | Unstyled / Semantic HTML5 | Native HTML controls | `pnpm add @sjsf/basic-theme` |

### Lab & Experimental Themes
- `@sjsf-lab/shadcn-extras-theme`: Extended widgets for shadcn-svelte.
- `@sjsf-lab/svar-theme`: SVAR core components.
- `@sjsf-lab/beercss-theme`: Beer CSS material design components.

---

## Supported Validators Matrix

SJSF requires a `FormValidator<T>` instance created via `createFormValidator`.

| Validator Package | Underlying Engine | Highlights | Precompiled Support | Installation Command |
| :--- | :--- | :--- | :--- | :--- |
| `@sjsf/ajv8-validator` | Ajv v8 | Industry standard Draft-07 validator, fastest runtime, extensive formats | Yes (`@sjsf/ajv8-validator/precompiled`) | `pnpm add @sjsf/ajv8-validator ajv ajv-formats` |
| `@sjsf/zod4-validator` | Zod v4 | Seamless integration when schemas are authored with Zod | N/A | `pnpm add @sjsf/zod4-validator zod` |
| `@sjsf/valibot-validator` | Valibot | Ultra-lightweight schema validation | N/A | `pnpm add @sjsf/valibot-validator valibot` |
| `@sjsf/cfworker-validator` | @cfworker/json-schema | Works in Cloudflare Workers and strict sandboxes | N/A | `pnpm add @sjsf/cfworker-validator @cfworker/json-schema` |
| `@sjsf/schemasafe-validator` | @exodus/schemasafe | ReDoS-safe validator without `eval` | Yes | `pnpm add @sjsf/schemasafe-validator @exodus/schemasafe` |
| `@sjsf/ata-validator` | ata-validator | Pure TypeScript validator with code generation | Yes | `pnpm add @sjsf/ata-validator` |

---

## Validator Configuration Examples

### Ajv v8 with Formats
```ts
import { createFormValidator } from "@sjsf/ajv8-validator";
import addFormats from "ajv-formats";

export const validator = createFormValidator({
  ajvPlugins: [addFormats],
  ajvOptions: { allErrors: true },
});
```

### Zod v4 Adapter
```ts
import { createFormValidator } from "@sjsf/zod4-validator";
import { z } from "zod";

export const validator = createFormValidator();
```
