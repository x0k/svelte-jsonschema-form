---
"@sjsf/sveltekit": minor
---

[BREAKING] Remote functions only:

- Bump minimal required SvelteKit version to `2.61.0`
- Remove special handling for enhanced form, no need for `fields: remoteForm.fields`
- Remove `F` generic parameter from `connect` function; the model type is now specified via `connect` generic instead of `createForm`: `createForm(await connect<Model>(createPost, {...}))`
