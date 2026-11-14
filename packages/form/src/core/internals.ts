/**
 * Symbol keys used by `CoreContext` and `FormState`.
 *
 * They are not exported from the `@sjsf/form/core` entry point. Import them
 * from `@sjsf/form/core/internals` only when you build or inspect a context
 * directly; otherwise use `createCoreContext` and the context functions.
 */
export const CORE_VALIDATOR = Symbol("core-validator");
export const CORE_MERGER = Symbol("core-merger");
export const CORE_ROOT_SCHEMA = Symbol("core-root-schema");
