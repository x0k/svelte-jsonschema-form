# 0008. Reject Separate Input/Output Type Parameters

The library uses a single generic type parameter `T` for form state, options, and validators (e.g. `FormState<T>`, `FormOptions<T>`, `FormValidator<T>`). An alternative approach using separate `Input` and `Output` type parameters was explored and rejected.

The single-parameter design reflects the library's primary use case: JSON Schema validation, where input and output types are identical. Splitting them into two parameters (with `Output = Input` as default) propagates additional complexity through the entire type system (83+ files, all validators, all themes, all SvelteKit integration code) without providing meaningful benefit for this core use case.

Users who need type transformations between form submission and validation output can handle this in their own code rather than having it baked into the library's type surface.

Related: <https://github.com/x0k/svelte-jsonschema-form/pull/229>
