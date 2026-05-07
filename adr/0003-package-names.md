# 0003. Package Names

All published packages are divided into two scopes: `@sjsf` and `@sjsf-lab`, following the rules below:

- Packages that cannot be stabilized at the moment are published under the `@sjsf-lab` scope.
  While in this scope, packages are versioned independently. Their major version matches the compatible version of `@sjsf/form`, and breaking changes may occur between minor versions.

- Stable packages are published under the `@sjsf` scope and are versioned in sync.
  Packages sharing the same version are considered compatible. If breaking changes are required in a non-core package (i.e., not `@sjsf/form`), a new package is created instead.

- When a package becomes deprecated (for example, due to being replaced by a newer one), it remains in the `@sjsf` scope but switches to independent versioning.

## Notes

- The package `@sjsf/flowbite3-theme` is named after the major version of the `flowbite` package, although its primary dependency is `flowbite-svelte`.
  This naming was chosen because at the time of releasing `@sjsf/flowbite-theme`, the `@sjsf-lab` scope (intended for unstable packages) had not yet been introduced, despite `flowbite-svelte@0.47` being unstable. After the release of `flowbite-svelte@1`, naming the package `@sjsf/flowbite1-theme` was considered undesirable.

- The package `@sjsf/shadcn4-theme` is named after the major version of `tailwindcss`, for the same reasons as the Flowbite theme.
