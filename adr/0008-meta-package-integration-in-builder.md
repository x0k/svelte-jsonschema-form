# 0008. Meta Package Integration in Builder

## Context

The `meta` package (`packages/meta`) is the central metadata registry for the monorepo — it provides types, runtime data, and code generation info for themes, validators, icon sets, resolvers, fields, and widgets via five export subpaths:

- `meta` — core types, CSS at-rules, package model, validators, themes, icons, fields, widgets, form sub-paths
- `meta/playground` — pre-built theme instances (with extra widgets), resolvers, icon sets, validators, form presets, styles
- `meta/playground/augmentations` — TypeScript module augmentations for playground components
- `meta/composer` — project composition layers (StackBlitz, SvelteLab)
- `meta/builder` — builder-specific validator factories

The `builder` app (`apps/builder`) has been partially integrated with `meta` on the `meta-integration` branch. However, the integration is incomplete:

1. **Type-checking is broken** — `WidgetTypes`, `ActualTheme`, `LabTheme`, and `Theme` are either not exported from meta's dist or missing from local re-exports.
2. **Duplicate data** — several large hardcoded records in the builder duplicate data already available in `meta` (extra widget imports, theme CSS at-rules).
3. **Builder-specific data not in meta** — widget display names, widget-to-extra-field mappings, and per-theme widget availability are hardcoded in the builder and should live in `meta/builder`.
4. **No derived widget availability** — the 422-line `THEME_SCHEMAS` record that maps per-theme per-node-type available widgets should be derived from meta's generated `WIDGETS` data.

## Decision

Adopt a phased approach to fully integrate `meta` into the builder:

### Phase 1: Fix Type-Checking and Eliminate Duplicates

**Goal**: Builder type-checks cleanly; all trivially duplicated data is replaced by meta imports.

- Fix `ActualTheme`/`LabTheme`/`Theme` types — derive from meta's `Theme`/`NonLegacyThemeOrSubTheme`/`isLabTheme()`
- Rebuild meta dist to include `WidgetTypes` export
- Replace `EXTRA_WIDGET_IMPORTS` with inverse of `WIDGETS[theme].extraWidgets`
- Replace `THEME_APP_CSS` with meta's `themeOrSubThemeAtRules()`
- Add `WIDGET_NAMES` and `WIDGET_EXTRA_FIELD` to `meta/builder` subpath
- Fix skeleton3→skeleton4 bug (auto-fixed by using `themeOrSubThemeAtRules()`)

### Phase 2: Derive Widget Availability from Meta

**Goal**: The 422-line `THEME_SCHEMAS` record is eliminated and replaced by a derivation from meta's generated `WIDGETS` data.

- Add a `widgetType → nodeType` mapping to `meta/builder`
- Add a function that computes available widgets per theme per node type from `WIDGETS` + the mapping
- Derive `THEME_CUSTOMIZABLE_NODE_TYPES` and `THEME_RANGE_VALUE_TYPES` from widget availability
- Add `shadcn-extras` as a supported theme in the builder

### Phase 3: Move Builder-Specific UI Config to Meta

**Goal**: All builder-specific per-theme configuration lives in `meta/builder` so it stays in sync with theme packages.

- Move `WIDGET_USE_LABEL` to `meta/builder`
- Move `TEXT_WIDGET_OPTIONS`, `CHECKBOXES_WIDGET_OPTIONS`, `RADIO_WIDGET_OPTIONS` to `meta/builder`
- Move `DEFAULT_COMPONENTS` to `meta/builder`

## Status

Accepted — phased implementation in progress on `meta-integration` branch.

## Consequences

- Adding a new widget to a theme package automatically makes it available in the builder (no builder changes needed).
- The builder no longer needs its own copy of theme/validator/icon metadata — source of truth is the generated metadata in `meta`.
- The skeleton3/skeleton4 CSS bug is fixed permanently.
- All three consumer apps (playground2, builder, docs) share the same metadata, preventing drift.
