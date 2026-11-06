# Svelte JSON Schema Form (SJSF) Skills

Central collection of AI agent skills for developing, customizing, integrating, and migrating [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form/) (v3) in Svelte 5 and SvelteKit projects.

Compatible with Gemini CLI, Claude Code, Antigravity, VS Code Copilot, Cursor, and any Agent Skills compliant CLI or editor.

## Skills Catalog

| Skill                                                  | Description                                                                                                                                                                       | Directory                                            |
| :----------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------- |
| **[sjsf-form-setup](./sjsf-form-setup)**               | Initialize and configure SJSF forms, setup `defaults.ts`, select themes/validators, handle controlled vs uncontrolled forms, and wire submit handlers.                            | [`sjsf-form-setup`](./sjsf-form-setup)               |
| **[sjsf-custom-components](./sjsf-custom-components)** | Create custom widgets, field templates, and component adapters using Svelte 5 runes (`$props`, `$bindable`), override theme components, and augment `UiOptions`.                  | [`sjsf-custom-components`](./sjsf-custom-components) |
| **[sjsf-schema-patterns](./sjsf-schema-patterns)**     | Design JSON Schema (Draft-07) and UI Schema, handle dynamic forms (`oneOf`/`anyOf` discriminators, `dependencies`, `if/then/else`), validation modes, and file uploads.           | [`sjsf-schema-patterns`](./sjsf-schema-patterns)     |
| **[sjsf-sveltekit](./sjsf-sveltekit)**                 | Integrate SJSF with SvelteKit (`@sjsf/sveltekit3`), server form actions (`createAction`), client `<SvelteKitForm>` (`createMeta`), progressive enhancement, and remote functions. | [`sjsf-sveltekit`](./sjsf-sveltekit)                 |
| **[sjsf-v2-migration](./sjsf-v2-migration)**           | Migrate SJSF codebases from v2 to v3, adapt to Svelte 5 runes, replace removed properties (`form.context`, `form.value`, `form.errors`), and update renamed packages.             | [`sjsf-v2-migration`](./sjsf-v2-migration)           |
| **[sjsf-monorepo-dev](./sjsf-monorepo-dev)**           | Monorepo development workflows: building packages, running vitest browser tests with Playwright, typechecking with Turbo, adding packages, and managing changesets.               | [`sjsf-monorepo-dev`](./sjsf-monorepo-dev)           |

---

## Installation

Install skills directly into your project or global agent environment using `npx skills`:

```bash
npx skills add https://github.com/x0k/svelte-jsonschema-form/
```

This command opens an interactive CLI to:

- Select skills to install
- Choose target agents (Universal, Gemini CLI, Claude Code, Antigravity, VS Code Copilot, Cursor, etc.)
- Set installation scope (Project or Global)

---

## Specification

All skills in this directory adhere to the [Agent Skills specification](https://agentskills.io/specification) and [Best Practices](https://agentskills.io/skill-creation/best-practices).
