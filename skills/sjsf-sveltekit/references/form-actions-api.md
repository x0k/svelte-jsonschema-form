# SvelteKit Form Actions API Reference (`@sjsf/sveltekit3`)

## Server-Side: `createAction` (`@sjsf/sveltekit3/server`)

```ts
import { createAction } from "@sjsf/sveltekit3/server";

export const actions = {
  default: createAction(options, handler)
};
```

### Options (`CreateActionOptions`)
- `schema`: JSON Schema Draft-07 describing form input.
- `validator`: SJSF validator factory (e.g. from `defaults.ts`).
- `name`: Form action identifier. Must match client `createMeta().<name>`.
- `sendData` (boolean): When `true`, returns validated form data back in the action result.
- `merger`: SJSF merger factory.
- `idBuilder`: SJSF ID builder factory.

### Handler Callback
Receives typed validated data:
```ts
({ title, content }: PostModel) => {
  // If invalid, return an array of error objects:
  if (isProfane(title)) {
    return [{ path: ["title"], message: "Title violates guidelines" }];
  }

  // If valid, execute business logic and return custom result:
  const post = db.createPost({ title, content });
  return { post };
}
```

---

## Client-Side: `<SvelteKitForm>` (`@sjsf/sveltekit3/client`)

### `createMeta`
Instantiates form metadata linking client to server action:
```ts
import { createMeta } from "@sjsf/sveltekit3/client";
import type { ActionData, PageData } from "./$types";

const meta = createMeta<ActionData, PageData>().form;
```

### Props on `<SvelteKitForm>`
- `meta`: Result from `createMeta()`.
- `refreshAll` (boolean): Invalidate all data on successful submission.
- `onSuccess(result)`: Callback after successful action response.
- `onError(result)`: Callback after error action response.
- All standard `FormOptions` from `@sjsf/form`.

---

## SJSF vs Superforms Comparison

| Feature | SJSF (`@sjsf/sveltekit3`) | Superforms |
| :--- | :--- | :--- |
| **Schema Standard** | JSON Schema Draft-07 (interoperable across backend languages) | Zod / Valibot / ArkType schemas |
| **Form Generation** | Automatic complete UI rendering from schema + theme | Client rendering done manually via form fields |
| **Theme Support** | shadcn, daisyUI, Skeleton, Flowbite plug-and-play | Manual markup styling |
| **Server Validation** | Integrated via `createAction` | Integrated via `superValidate` |
