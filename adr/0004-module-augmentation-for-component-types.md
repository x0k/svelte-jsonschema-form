# 0004. Module Augmentation for Component Types

Component types (`ComponentProps`, `ComponentBindings`, `ExtraComponents`, `UiOptions`) are built up via `declare module` augmentation scattered across several files rather than centralized in a single definition.

When working with the project directly, tsc loads all `*.ts` files and all augmentations take effect. When the project is used as a library, tsc only includes code that the consumer explicitly imports, so the final type will correspond to the features the user has included — e.g., importing `@sjsf/form/fields/extra/enum-include` adds `enumField` to `ComponentProps`, but without that import the type doesn't include it.

This also enables third-party theme packages to augment the same interfaces from their own code, which would be impossible with a centralized definition.
