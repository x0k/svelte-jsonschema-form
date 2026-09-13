---
"@sjsf/form": major
"@sjsf/basic-theme": major
"@sjsf/daisyui5-theme": major
"@sjsf/flowbite3-theme": major
"@sjsf/shadcn4-theme": major
"@sjsf/skeleton5-theme": major
"@sjsf/sveltekit": major
"@sjsf-lab/beercss-theme": major
"@sjsf-lab/svar-theme": major
"@sjsf-lab/shadcn-extras-theme": major
"@sjsf/flowbite-theme": major
"@sjsf/skeleton4-theme": major
"@sjsf/shadcn-theme": major
---

Replace the customizable `form` foundational component with a platform-agnostic `root` layout slot:

- `ComponentProps["form"]` (`{ config, ref, children, attributes }`) → `ComponentProps["root"]` (`{ config, children }`); `ComponentBindings["form"]` (`"ref"`) → `ComponentBindings["root"]` (`""`); `FoundationalComponents["form"]` → `["root"]`
- `Form` export → `Root` export; `BasicForm` now renders a plain web `<form bind:this={ref} {@attach handlers(form)} {...attributes}>` with `<Root><Content /><SubmitButton /></Root>` inside (`BasicForm` and `handlers` are web-only, part of the `main` web entry; a future `native` submodule reuses `Root`/`Content`/`SubmitButton`/`createForm`)
- `formAttributes()` helper removed; `ui:options.form` (`HTMLFormAttributes`) replaced by `ui:options.root` (`HTMLAttributes<HTMLDivElement>`, merged via the new `rootAttributes()` helper) — form element attributes (`action`/`method`/`enctype`/etc.) are no longer merged, pass them directly to `BasicForm`
- Root pseudo-element `form` → `root` (`getPseudoPath`, `IdentifiableFieldElement`); per-path `ui:components`/`ui:options` overrides and derived IDs keyed on the old `form` element must be renamed
- Themes: `form.svelte` → `root.svelte` (layout `<div>` with `rootAttributes(ctx, config, "root", …)`), `exports.ts` (`form` → `root`), `UiOptions { form }` augmentation replaced by `UiOptions { root }` in basic theme
- `@sjsf/sveltekit` is stubbed (non-functional, throws until the `sveltekit3` package is available): `createUiSchemaWithFormAttributes`, `createClientValidator`, `connect`, and `setupSvelteKitForm` keep their signatures but throw; `ui:options.form` demo usages removed
