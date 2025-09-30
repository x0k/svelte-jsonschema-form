# @sjsf/form

## 3.0.0-next.5

### Major Changes

- - Added a **required** `path` property to the `Config` type ([#207](https://github.com/x0k/svelte-jsonschema-form/pull/207))
  - Updated the `JsonPaths` type to return a union of `Path`s
  - Replaced the `name` prop with `path` in the `Field` component

- Remove generic validator parameter ([#207](https://github.com/x0k/svelte-jsonschema-form/pull/207))

- - Added a new **required** `createForm` parameter: `createIdBuilder` ([#205](https://github.com/x0k/svelte-jsonschema-form/pull/205))
  - Removed the `idSeparator` and `idPseudoSeparator` parameters
  - Removed the following types:
    - `IdPrefixOption`
    - `IdSeparatorOption`
    - `IdPseudoSeparator`
    - `IdOptions`
    - `PathToIdOptions`
  - `focus-on-first-error` module changes:
    - Updated signatures of `getErrorsList` and `getFocusAction`
    - Removed the `GetFocusActionOptions` type

- - Replace `id` property with `path` in `Config` type ([#209](https://github.com/x0k/svelte-jsonschema-form/pull/209))
  - Remove `from.errors` property
  - Remove form `errors` bindable option
  - Replace `idFromPath` with `createId` function
  - Replace `createChildId` with `createChildPath` function
  - Replace `getErrors` with `getFieldErrors` function
  - Add `updateErrors`, `hasErrors`, `getErrors` functions

- Remove `create` prefix from creatable form options ([#208](https://github.com/x0k/svelte-jsonschema-form/pull/208))

- Change the error type to simple `string` ([#207](https://github.com/x0k/svelte-jsonschema-form/pull/207))

- Replace the `validate` and `validateAsync` form methods with separate functions ([#209](https://github.com/x0k/svelte-jsonschema-form/pull/209))

### Minor Changes

- Allow to return update callback from form validator methods ([#207](https://github.com/x0k/svelte-jsonschema-form/pull/207))

## 3.0.0-next.4

### Patch Changes

- Fix field state cleanup ([`ca11ecb`](https://github.com/x0k/svelte-jsonschema-form/commit/ca11ecbc71f18ce0c043e8a55a34a4b4b5010c67))

## 3.0.0-next.3

### Patch Changes

- Fix SSR rendering ([`d60f113`](https://github.com/x0k/svelte-jsonschema-form/commit/d60f1131132613571b2ce3bd1fcf70ef24aae1a4))

## 3.0.0-next.2

### Major Changes

- Bump minimal `svelte` version to `5.39.0` ([#202](https://github.com/x0k/svelte-jsonschema-form/pull/202))

- Add support for nullable schemas ([#202](https://github.com/x0k/svelte-jsonschema-form/pull/202))

- Refactor standard schema validator factory signature ([#202](https://github.com/x0k/svelte-jsonschema-form/pull/202))

- - The `makeEventHandlers` function signature has been updated ([`181c3ce`](https://github.com/x0k/svelte-jsonschema-form/commit/181c3ce45c6897a0fffc6c73d0ed2db838dc83c1))
  - Added the `hasFieldState` function to check a field’s state
  - The `isSubmitted` and `isChanged` properties are now `readonly`
  - `isSubmitted` is reset after successful processing (validation + `onSubmit` handler)
  - `isChanged` becomes `true` after any interaction before the form is submitted or reset

- Make `itemValue` parameter of `ItemTitle` function required ([#202](https://github.com/x0k/svelte-jsonschema-form/pull/202))

- Extract handlers application into `handlersAttachment` helper ([#202](https://github.com/x0k/svelte-jsonschema-form/pull/202))

- Remove `@sjsf/form/extra-fields/date-field` extra field definition ([`3c90ec2`](https://github.com/x0k/svelte-jsonschema-form/commit/3c90ec22f934f28862c6515987e367c3078e21d8))

- Remove `validate` method form `ObjectContext` and `ArrayContext` interfaces ([`3ac49c9`](https://github.com/x0k/svelte-jsonschema-form/commit/3ac49c954675ded403ac1a25e2dd4782fc223600))

### Minor Changes

- Export `createArrayComparator` and `ascComparator` functions ([#202](https://github.com/x0k/svelte-jsonschema-form/pull/202))

- Add and implement `collectErrors` UI option for `tags` field ([#202](https://github.com/x0k/svelte-jsonschema-form/pull/202))

- Add `aggregatedField` field and `aggregatedWidget` widget definition ([`3100b4d`](https://github.com/x0k/svelte-jsonschema-form/commit/3100b4d109798494a157a453f46c0e1cf2d746ae))

### Patch Changes

- Port https://github.com/rjsf-team/react-jsonschema-form/pull/4771 ([#202](https://github.com/x0k/svelte-jsonschema-form/pull/202))

## 3.0.0-next.1

### Major Changes

- Add `unknown` schema type ([#200](https://github.com/x0k/svelte-jsonschema-form/pull/200))

### Minor Changes

- Allow to extend `SchemaValue` type ([#200](https://github.com/x0k/svelte-jsonschema-form/pull/200))

- Add `AsyncFileListValidator` validator ([#200](https://github.com/x0k/svelte-jsonschema-form/pull/200))

- Add node.js support for `lib/file` ([#200](https://github.com/x0k/svelte-jsonschema-form/pull/200))

- Add `nativeFile*` fields ([#200](https://github.com/x0k/svelte-jsonschema-form/pull/200))

- Add `validators/file-size` validator ([#200](https://github.com/x0k/svelte-jsonschema-form/pull/200))

### Patch Changes

- Fix changes propagation in keyed array ([`b649510`](https://github.com/x0k/svelte-jsonschema-form/commit/b649510948cb89d62568e2624bd008a30832c6b2))

## 3.0.0-next.0

### Major Changes

- - Add `mergeSchemas` method to the `Merger` interface ([#177](https://github.com/x0k/svelte-jsonschema-form/pull/177))
  - Update `resolveAllReferences` and related functions to accept a `Merger` instance for schema merging
  - Make `merger` form option required

- Refactor array field context to make it extendable ([#198](https://github.com/x0k/svelte-jsonschema-form/pull/198))

- Refactor `KeyedArray` interface ([#198](https://github.com/x0k/svelte-jsonschema-form/pull/198))

- Refactor object field context to make it extendable ([#198](https://github.com/x0k/svelte-jsonschema-form/pull/198))

- Add `length`, `set` and `validate` methods to `ArrayContext` interface ([#198](https://github.com/x0k/svelte-jsonschema-form/pull/198))

- Replace `validator` and `merger` with required `createValidator` and `createMerger` options. ([#177](https://github.com/x0k/svelte-jsonschema-form/pull/177))
  Consider all options as reactive.

- Remove deprecated code ([#196](https://github.com/x0k/svelte-jsonschema-form/pull/196))

- Replace `FormInternalContext` with `FormState` ([#197](https://github.com/x0k/svelte-jsonschema-form/pull/197))

### Minor Changes

- Add `validate` and `validateAsync` form methods ([#198](https://github.com/x0k/svelte-jsonschema-form/pull/198))

- Add `createValidator` and `createMerger` form options for convenient use as defaults values. ([#177](https://github.com/x0k/svelte-jsonschema-form/pull/177))
  Add `errors` option for creating controlled forms.
  Rename `formHandlers` to `handlers`.

## 2.4.0

### Minor Changes

- Add `Ref` and `Bind` types ([#190](https://github.com/x0k/svelte-jsonschema-form/pull/190))

- Export mergers from `form/mergers` ([#191](https://github.com/x0k/svelte-jsonschema-form/pull/191))

- Add `json-schema`, `math`, `ord`, `traverser` libs, new `array` functions ([#191](https://github.com/x0k/svelte-jsonschema-form/pull/191))

## 2.3.0

### Minor Changes

- Pass item value to `itemTitle` function ([#178](https://github.com/x0k/svelte-jsonschema-form/pull/178))

- Add `keyedArraysMap` form option ([#180](https://github.com/x0k/svelte-jsonschema-form/pull/180))

- Add `keyedArray` option to `createArrayContext`, `createTupleContext` functions. ([#182](https://github.com/x0k/svelte-jsonschema-form/pull/182))

### Patch Changes

- Port https://github.com/rjsf-team/react-jsonschema-form/pull/4757 ([`8772516`](https://github.com/x0k/svelte-jsonschema-form/commit/877251689dc60c91b7d2a257c3f05665d9a7ea96))

- Fix population of missing tuple items ([`66ca1a5`](https://github.com/x0k/svelte-jsonschema-form/commit/66ca1a5001a65fa794e8fcb6b1362c8365ff6686))

- Port https://github.com/rjsf-team/react-jsonschema-form/pull/4745 ([`123fc70`](https://github.com/x0k/svelte-jsonschema-form/commit/123fc70c1e7ef7ad1d045584790d48c957b6f03c))

## 2.2.4

### Patch Changes

- Revert "[form] Preserve array keys by injecting default values instead of state replacing" ([`bab9bce`](https://github.com/x0k/svelte-jsonschema-form/commit/bab9bce095f75884fb7444f9c8a6640599c861e1))

## 2.2.3

### Patch Changes

- Fix omitting dependency arrays in the schema transformer ([`8be9383`](https://github.com/x0k/svelte-jsonschema-form/commit/8be93831dfcda3716067dc02349f6c4011489967))

- Preserve array keys by injecting default values instead of state replacing ([#170](https://github.com/x0k/svelte-jsonschema-form/pull/170))

## 2.2.2

## 2.2.1

### Patch Changes

- Port <https://github.com/rjsf-team/react-jsonschema-form/pull/4710> ([`9cf65bd`](https://github.com/x0k/svelte-jsonschema-form/commit/9cf65bdfc54bc5a3da432fd1d2e01501c31e0993))

- Deprecate `from.context` property ([#159](https://github.com/x0k/svelte-jsonschema-form/pull/159))

## 2.2.0

### Minor Changes

- Add `value` option ([#158](https://github.com/x0k/svelte-jsonschema-form/pull/158))

- Add a `task.svelte` submodule to replace `action.svelte` ([`3488450`](https://github.com/x0k/svelte-jsonschema-form/commit/3488450e7b26e285a17f86996beb32e7dbdc7b66))

### Patch Changes

- Migrate to `task.svelte` lib ([`803d56d`](https://github.com/x0k/svelte-jsonschema-form/commit/803d56dcb8dd0fe135d104ecbdb54eb529a83401))

## 2.1.2

### Patch Changes

- Clarify the empty field name warning in the `Field` component ([`35afc7b`](https://github.com/x0k/svelte-jsonschema-form/commit/35afc7b801026f64fe2d9f278c2a31fd714fec48))

- Fix display of custom enum names in `booleanSelectField` ([`f2f1cbc`](https://github.com/x0k/svelte-jsonschema-form/commit/f2f1cbcfcdcfe7e5999a69c5d21903f24a0be978))

## 2.1.1

## 2.1.0

## 2.0.2

### Patch Changes

- Port https://github.com/rjsf-team/react-jsonschema-form/pull/4665 ([`d06b974`](https://github.com/x0k/svelte-jsonschema-form/commit/d06b974a79b26bb2a6501e72cfe3806331292b56))

- Fix generation of `d.ts` file for `Field` component ([`e9f95fe`](https://github.com/x0k/svelte-jsonschema-form/commit/e9f95fe89ffed00eec7f6ce434f30dbedea117cc))

- Remove the use of `effect.pre` to set the object's default values ([#138](https://github.com/x0k/svelte-jsonschema-form/pull/138))

## 2.0.1

### Patch Changes

- Deprecate `children` prop in `Field` component ([`d3c05fe`](https://github.com/x0k/svelte-jsonschema-form/commit/d3c05fe33cb0847b4db3422a46e3372988dc40fc))

- Fixed `Field` component template ([`935d414`](https://github.com/x0k/svelte-jsonschema-form/commit/935d41467d0a2d84e9f0c5dd2cf9e8f8b9f6f406))

## 2.0.0

### Major Changes

- Add support for `$ref` in UI schema ([#100](https://github.com/x0k/svelte-jsonschema-form/pull/100))

- Add `label` component ([`b215668`](https://github.com/x0k/svelte-jsonschema-form/commit/b215668587f9add91fc848cc579746303f3ba0f7))

- Remove `lib/deep-equal` submodule ([`3f780ca`](https://github.com/x0k/svelte-jsonschema-form/commit/3f780cab808f9316911d9b13b39b7ce159c8f234))

- Add `useLabel` property for the `fieldTemplate` component ([`e8eaae3`](https://github.com/x0k/svelte-jsonschema-form/commit/e8eaae3d332ced78d87748d56dd0f05117ec92d5))

- Extract array field logic into `createArrayContext` function ([`99b77fb`](https://github.com/x0k/svelte-jsonschema-form/commit/99b77fb416960e7204154a29826684af1939792a))

- Remove `forId` from the `errorList` component props ([`f6588ff`](https://github.com/x0k/svelte-jsonschema-form/commit/f6588ff52f88ee9d6f5c1cebdcb80db8b736acea))

- Remove `uiOptions` property from `Config` ([#100](https://github.com/x0k/svelte-jsonschema-form/pull/100))

- Bump peer and dev dependencies ([`21e47cc`](https://github.com/x0k/svelte-jsonschema-form/commit/21e47cccb6f53c698582db9c3639a33672e21552))

- Rename `fields/extra-widgets/file-widget` to `fields/extra-widgets/file` ([`d75d847`](https://github.com/x0k/svelte-jsonschema-form/commit/d75d84772fdc7636ddc0862719d69f3f296e15bc))

- Remove `name` property from `Config` ([`1da5c84`](https://github.com/x0k/svelte-jsonschema-form/commit/1da5c84e06d61eee970d3149bad2a5bddea16e35))

- Make `checkboxes` and `file` widgets optional ([`8fa706b`](https://github.com/x0k/svelte-jsonschema-form/commit/8fa706b7e69ec3cba54e689a536b1038ff8e5c83))

- Replace `asyncProxy` with `createAsyncBinding` ([#119](https://github.com/x0k/svelte-jsonschema-form/pull/119))

- Refactor action logic: ([`8606f26`](https://github.com/x0k/svelte-jsonschema-form/commit/8606f26c183cdfaf6e37a889412930e59714aad9))
  - Remove `debounce` combinator
  - Add `untrack` combinator result

- The `DefaultFormMerger` class has been replaced by the `createFormMerger` factory. ([`43c86da`](https://github.com/x0k/svelte-jsonschema-form/commit/43c86da731ee53fbad8da451dcc4c534de39e881))

- Update `initialValue` type in `FormOptions` to be `Partial<T>` ([#135](https://github.com/x0k/svelte-jsonschema-form/pull/135))

- Rename `FoundationalComponent` to `FoundationalComponentType` ([`9ca2d7f`](https://github.com/x0k/svelte-jsonschema-form/commit/9ca2d7f7aec5d0dec83f61032a38298d68757f01))

- Relax component compatibility checks. ([`cb176ac`](https://github.com/x0k/svelte-jsonschema-form/commit/cb176ac730f085d715dbd68621c597babcf5c3b9))
  Add a `type` discriminator for field, template, and widget properties.
  Remove `Equal` and `ExpandAndEqual` types from `lib/types`

- Remove `use-mutation` submodule ([`c616f00`](https://github.com/x0k/svelte-jsonschema-form/commit/c616f00b92f321c46e8c37d3eb52be51bb417a4d))

- Remove `proxy` function from `lib/svelte.svelte` ([`1138f61`](https://github.com/x0k/svelte-jsonschema-form/commit/1138f616c30cd6e722bef3a037aed08e92033ac9))

- Migrate to `resolver` based providers ([`dfd96e7`](https://github.com/x0k/svelte-jsonschema-form/commit/dfd96e75abd0c05ee246831e36e1fdd34957a166))

- Bump svelte to 5.25.0, relax patch versions of peer dependencies. ([`33fcab1`](https://github.com/x0k/svelte-jsonschema-form/commit/33fcab1e99d3da5d464cbd814b4f8445ceb2e4d9))

- Refactor form API: ([`daabc32`](https://github.com/x0k/svelte-jsonschema-form/commit/daabc32f7c3db21a763d755abd952a417d0d7e3b))
  - Renames:
    - `form.validation` -> `form.submission`
    - `validationCombinator` -> `submissionCombinator`
    - `validationDelayedMs` -> `submissionDelayedMs`
    - `validationTimeoutMs` -> `submissionTimeoutMs`
  - `form.submit` now returns `void`

- Add support for extra attributes in input, textarea, and select attribute functions ([`ef7ea00`](https://github.com/x0k/svelte-jsonschema-form/commit/ef7ea0027037457b540bf3534759b9938d0d6620))

- Move `checkboxes` and `file` widgets to extra folder ([`701c3fc`](https://github.com/x0k/svelte-jsonschema-form/commit/701c3fc1e01e38c4c7168bdf0f0ab9b17be8cb50))

- Remove the UI options `submitButtonText` and `additionalPropertyKeyPrefix` in favor of the new `translations` option. ([`f30da6d`](https://github.com/x0k/svelte-jsonschema-form/commit/f30da6d2b9161d848e3ec1be631d555b20783739))

- Fix <https://github.com/x0k/svelte-jsonschema-form/issues/103> ([`1c75328`](https://github.com/x0k/svelte-jsonschema-form/commit/1c753287e206049acec0d19aa60c85f8ef902b4c))

  Renames in the following submodules:
  - `@sjsf/form/fields/array/*`
  - `@sjsf/form/fields/object/*`
  - `@sjsf/form/templates/*`

- Remove `legacy-omit-extra-data` submodule ([`3c865f3`](https://github.com/x0k/svelte-jsonschema-form/commit/3c865f3fbd66d27ad35c6e7df89a9df439400288))

- Refactor action logic: ([`d958dfc`](https://github.com/x0k/svelte-jsonschema-form/commit/d958dfc01fb53df12c3942ee778e680e805fcf79))
  - `run` methods now returns `void`
  - Added `runAsync` method that returns `Promise<R>`
  - Fixed `state_referenced_locally` warning

- Remove `asSnippet` function ([`a9dc859`](https://github.com/x0k/svelte-jsonschema-form/commit/a9dc8591f6e7cc240b947cded0dca2fd1280b622))

- Rename `FormTag` to `Form` ([#100](https://github.com/x0k/svelte-jsonschema-form/pull/100))

- Rename `setFromContext` to `setFormContext` ([`e9a861b`](https://github.com/x0k/svelte-jsonschema-form/commit/e9a861bfb77feea2d716c6123ff37580d5b65935))

- Remove `UiSchemaRootContent` type ([`49e4b89`](https://github.com/x0k/svelte-jsonschema-form/commit/49e4b89f302c54fdb664e0604a316bf6ab02da30))

- Extract object field logic into `createObjectContext` function ([`73ee1fb`](https://github.com/x0k/svelte-jsonschema-form/commit/73ee1fb8c35b43c00e6e0d1045d3672f05e78842))

- Add support for `patternProperties` keyword ([`162b001`](https://github.com/x0k/svelte-jsonschema-form/commit/162b0018a630c58e72a775af02d6655cc8e65fab))

- Rename submodule `prevent-data-loss` to `prevent-page-reload` ([`1ae4972`](https://github.com/x0k/svelte-jsonschema-form/commit/1ae49721a3628c6777b772b6c167e9c8343ec1cc))

- Replace action `Status` enum with string literals ([`5e85a87`](https://github.com/x0k/svelte-jsonschema-form/commit/5e85a873fe50283f0a2c09ed30e599c6f28fc6db))

- Remove `validate` and `validateAsync` form state methods ([#130](https://github.com/x0k/svelte-jsonschema-form/pull/130))

- Remove `AnyKey` type ([`d569453`](https://github.com/x0k/svelte-jsonschema-form/commit/d569453b17f4187291dfb319b132dc00de7bf35a))

- Migrate to a new `Validator` type model ([`dfd96e7`](https://github.com/x0k/svelte-jsonschema-form/commit/dfd96e75abd0c05ee246831e36e1fdd34957a166))

- Remove `required` and `forId` from the `title` component props ([`52676ca`](https://github.com/x0k/svelte-jsonschema-form/commit/52676ca7976f6cff6053bba48d73193881b93405))

- Remove `getValueByPath` function ([`1516c2d`](https://github.com/x0k/svelte-jsonschema-form/commit/1516c2dde9256c87118db659d7dd904b370d65ec))

### Minor Changes

- Add `fromFactories` function to `lib/resolver` ([`61b8dab`](https://github.com/x0k/svelte-jsonschema-form/commit/61b8daba452f2490457a2b6f202c81276705efc4))

- Add `tagsField` extra field and `tagsWidget` extra widget definition ([`cff3574`](https://github.com/x0k/svelte-jsonschema-form/commit/cff3574d8921e4fa09fd55c1c60c2e95a4984297))

- Add `env` lib ([#71](https://github.com/x0k/svelte-jsonschema-form/pull/71))

- Add combobox widget type ([`4abf5d6`](https://github.com/x0k/svelte-jsonschema-form/commit/4abf5d6660e27e8986cb0012585920457682eaf9))

- The `getValueByPath` function has been returned. ([`f37bf4a`](https://github.com/x0k/svelte-jsonschema-form/commit/f37bf4a9e49eec84bb64b8471ff8f34bc056fdd8))

- Add `css` lib ([#71](https://github.com/x0k/svelte-jsonschema-form/pull/71))

- Add `extraUiOptions` property to form options ([`1a552e8`](https://github.com/x0k/svelte-jsonschema-form/commit/1a552e8f43c65a3af595f313739200ca97c69e97))

- Pass `widgetType` property to the `fieldTemplate` component ([`749a333`](https://github.com/x0k/svelte-jsonschema-form/commit/749a3333969401b8758f28672585f1ba7a140984))

- Add `useDatePickerForDateFormat` function to `fields/extra-widgets/date-picker` ([`768f8c2`](https://github.com/x0k/svelte-jsonschema-form/commit/768f8c206e475dc6acdeaf8a4db7fa8c4ce4d965))

- Use `untrack` inside the following `Action` methods: `run`, `runAsync`, and `abort`. ([`5206095`](https://github.com/x0k/svelte-jsonschema-form/commit/5206095ce57d9d69b38fc622ac50b72f9bbb5870))

- Export `JsonPaths` type form `@sjsf/form/lib/types` ([#135](https://github.com/x0k/svelte-jsonschema-form/pull/135))

- Add `getSchemaDefinitionByPath` function ([`eb9ad24`](https://github.com/x0k/svelte-jsonschema-form/commit/eb9ad249cec7ff3eb678203948b7e430771af958))

- Add `validators/precompile` submodule ([`9882dd8`](https://github.com/x0k/svelte-jsonschema-form/commit/9882dd8b84a19be80d47786708379fedcda2db31))

- Add `Field` component ([#135](https://github.com/x0k/svelte-jsonschema-form/pull/135))

- Add `lib/component` submodule ([#100](https://github.com/x0k/svelte-jsonschema-form/pull/100))

- Add `matches` method to `Action` for type narrowing ([`f626bd8`](https://github.com/x0k/svelte-jsonschema-form/commit/f626bd8d42000b85d9a170890fadbb1c28ed9009))

- Add `arraySubSchemasMergeType` option for `mergeSchemas` function ([`b2c896b`](https://github.com/x0k/svelte-jsonschema-form/commit/b2c896b2058b56a4f4ee5794f490f6298a375f94))

- Add `getUiSchemaByPath` function ([`283d6de`](https://github.com/x0k/svelte-jsonschema-form/commit/283d6de26b63bbf65ec5d2c2e3c73e42ac43b898))

- Add `resolver` lib ([`d5c93c3`](https://github.com/x0k/svelte-jsonschema-form/commit/d5c93c32811cfb466a8b8c6849b3d215c403330b))

- Add options parameter to `createFormMerger` factory ([`0bcf9c6`](https://github.com/x0k/svelte-jsonschema-form/commit/0bcf9c674d9817f4665ef737284ac6e5514055f7))

- Add support for `discriminator` schema property ([`f6fd57c`](https://github.com/x0k/svelte-jsonschema-form/commit/f6fd57c724450da74b26fc63cdb5fdb510203613))

- Add standard schema form value validator ([`c43eb93`](https://github.com/x0k/svelte-jsonschema-form/commit/c43eb932cbb82b4ba802cd1aff4a35ae2a5f0c88))

- Add `registry` form option ([#100](https://github.com/x0k/svelte-jsonschema-form/pull/100))

- Add function `getRootSchemaTitleByPath` ([`84f9ff9`](https://github.com/x0k/svelte-jsonschema-form/commit/84f9ff9cc15bd252da3967e9dcc1755ffa024e06))

### Patch Changes

- Port https://github.com/rjsf-team/react-jsonschema-form/pull/4617 ([`38ae583`](https://github.com/x0k/svelte-jsonschema-form/commit/38ae58337d6b240a4fda87d4428bd979a952baf7))

- Fix <https://github.com/x0k/svelte-jsonschema-form/issues/72> ([`f1c6d71`](https://github.com/x0k/svelte-jsonschema-form/commit/f1c6d713afbcee2de58d78770041c674bc3adc1f))

- Port https://github.com/rjsf-team/react-jsonschema-form/pull/4644 ([`00a1ea1`](https://github.com/x0k/svelte-jsonschema-form/commit/00a1ea1c431c7f8637cb2cc5e3aa73dd6d94771f))

- Refactor async logic in file fields ([#118](https://github.com/x0k/svelte-jsonschema-form/pull/118))

- Port https://github.com/rjsf-team/react-jsonschema-form/pull/4637 ([`ba140fb`](https://github.com/x0k/svelte-jsonschema-form/commit/ba140fb1ad3e371cb5c163b869998e20750db939))

- Improve focusable element detection ([`ebb8315`](https://github.com/x0k/svelte-jsonschema-form/commit/ebb83153f49052b368b1a5e543f43dc6e3bb8922))

- Fix theme resolver type ([`b1221f9`](https://github.com/x0k/svelte-jsonschema-form/commit/b1221f9536dec48a26f8d93d4ded8cebe21faf5d))

- Port https://github.com/rjsf-team/react-jsonschema-form/pull/4570 ([#100](https://github.com/x0k/svelte-jsonschema-form/pull/100))

- Port <https://github.com/rjsf-team/react-jsonschema-form/pull/4600> ([`1e641de`](https://github.com/x0k/svelte-jsonschema-form/commit/1e641de9ce630da729bf295c508371dabaa2e802))

- Refactor matching logic to improve validation performance and accuracy ([`69535c3`](https://github.com/x0k/svelte-jsonschema-form/commit/69535c3d53fd2d95b2e02d0fe5e6c309aa4d0df6))

- Fixed `enumField` recognition in `compat` resolver ([`6f4942b`](https://github.com/x0k/svelte-jsonschema-form/commit/6f4942b24f754ad99040f35cbaa2285d4d9d7c27))

- Fix type of `fields` resolver ([`8f33350`](https://github.com/x0k/svelte-jsonschema-form/commit/8f33350406c80deb6092f720da99f0045b34f5d7))

- Port https://github.com/rjsf-team/react-jsonschema-form/pull/4626 ([`50c357a`](https://github.com/x0k/svelte-jsonschema-form/commit/50c357a57b7819a83ceab99a96d09b21af848b17))

## 2.0.0-next.15

### Major Changes

- Bump peer and dev dependencies ([`21e47cc`](https://github.com/x0k/svelte-jsonschema-form/commit/21e47cccb6f53c698582db9c3639a33672e21552))

- Replace `asyncProxy` with `createAsyncBinding` ([#119](https://github.com/x0k/svelte-jsonschema-form/pull/119))

### Patch Changes

- Port https://github.com/rjsf-team/react-jsonschema-form/pull/4644 ([`00a1ea1`](https://github.com/x0k/svelte-jsonschema-form/commit/00a1ea1c431c7f8637cb2cc5e3aa73dd6d94771f))

- Refactor async logic in file fields ([#118](https://github.com/x0k/svelte-jsonschema-form/pull/118))

- Port https://github.com/rjsf-team/react-jsonschema-form/pull/4637 ([`ba140fb`](https://github.com/x0k/svelte-jsonschema-form/commit/ba140fb1ad3e371cb5c163b869998e20750db939))

## 2.0.0-next.14

## 2.0.0-next.13

## 2.0.0-next.12

### Major Changes

- Remove the UI options `submitButtonText` and `additionalPropertyKeyPrefix` in favor of the new `translations` option. ([`f30da6d`](https://github.com/x0k/svelte-jsonschema-form/commit/f30da6d2b9161d848e3ec1be631d555b20783739))

- Fix <https://github.com/x0k/svelte-jsonschema-form/issues/103> ([`1c75328`](https://github.com/x0k/svelte-jsonschema-form/commit/1c753287e206049acec0d19aa60c85f8ef902b4c))

  Renames in the following submodules:
  - `@sjsf/form/fields/array/*`
  - `@sjsf/form/fields/object/*`
  - `@sjsf/form/templates/*`

### Patch Changes

- Port https://github.com/rjsf-team/react-jsonschema-form/pull/4617 ([`38ae583`](https://github.com/x0k/svelte-jsonschema-form/commit/38ae58337d6b240a4fda87d4428bd979a952baf7))

- Port <https://github.com/rjsf-team/react-jsonschema-form/pull/4600> ([`1e641de`](https://github.com/x0k/svelte-jsonschema-form/commit/1e641de9ce630da729bf295c508371dabaa2e802))

- Port https://github.com/rjsf-team/react-jsonschema-form/pull/4626 ([`50c357a`](https://github.com/x0k/svelte-jsonschema-form/commit/50c357a57b7819a83ceab99a96d09b21af848b17))

## 2.0.0-next.11

### Major Changes

- Add support for `patternProperties` keyword ([`162b001`](https://github.com/x0k/svelte-jsonschema-form/commit/162b0018a630c58e72a775af02d6655cc8e65fab))

### Minor Changes

- Add support for `discriminator` schema property ([`f6fd57c`](https://github.com/x0k/svelte-jsonschema-form/commit/f6fd57c724450da74b26fc63cdb5fdb510203613))

## 2.0.0-next.10

### Major Changes

- Add support for `$ref` in UI schema ([#100](https://github.com/x0k/svelte-jsonschema-form/pull/100))

- Remove `uiOptions` property from `Config` ([#100](https://github.com/x0k/svelte-jsonschema-form/pull/100))

- Rename `FormTag` to `Form` ([#100](https://github.com/x0k/svelte-jsonschema-form/pull/100))

### Minor Changes

- Add `lib/component` submodule ([#100](https://github.com/x0k/svelte-jsonschema-form/pull/100))

- Add `registry` form option ([#100](https://github.com/x0k/svelte-jsonschema-form/pull/100))

### Patch Changes

- Port https://github.com/rjsf-team/react-jsonschema-form/pull/4570 ([#100](https://github.com/x0k/svelte-jsonschema-form/pull/100))

## 2.0.0-next.9

### Major Changes

- Extract array field logic into `createArrayContext` function ([`99b77fb`](https://github.com/x0k/svelte-jsonschema-form/commit/99b77fb416960e7204154a29826684af1939792a))

- Extract object field logic into `createObjectContext` function ([`73ee1fb`](https://github.com/x0k/svelte-jsonschema-form/commit/73ee1fb8c35b43c00e6e0d1045d3672f05e78842))

### Minor Changes

- Add `validators/precompile` submodule ([`9882dd8`](https://github.com/x0k/svelte-jsonschema-form/commit/9882dd8b84a19be80d47786708379fedcda2db31))

- Add `arraySubSchemasMergeType` option for `mergeSchemas` function ([`b2c896b`](https://github.com/x0k/svelte-jsonschema-form/commit/b2c896b2058b56a4f4ee5794f490f6298a375f94))

## 2.0.0-next.8

### Major Changes

- Rename `fields/extra-widgets/file-widget` to `fields/extra-widgets/file` ([`d75d847`](https://github.com/x0k/svelte-jsonschema-form/commit/d75d84772fdc7636ddc0862719d69f3f296e15bc))

- Rename `FoundationalComponent` to `FoundationalComponentType` ([`9ca2d7f`](https://github.com/x0k/svelte-jsonschema-form/commit/9ca2d7f7aec5d0dec83f61032a38298d68757f01))

- Relax component compatibility checks. ([`cb176ac`](https://github.com/x0k/svelte-jsonschema-form/commit/cb176ac730f085d715dbd68621c597babcf5c3b9))
  Add a `type` discriminator for field, template, and widget properties.
  Remove `Equal` and `ExpandAndEqual` types from `lib/types`

- Add support for extra attributes in input, textarea, and select attribute functions ([`ef7ea00`](https://github.com/x0k/svelte-jsonschema-form/commit/ef7ea0027037457b540bf3534759b9938d0d6620))

- Remove `UiSchemaRootContent` type ([`49e4b89`](https://github.com/x0k/svelte-jsonschema-form/commit/49e4b89f302c54fdb664e0604a316bf6ab02da30))

### Minor Changes

- Add `fromFactories` function to `lib/resolver` ([`61b8dab`](https://github.com/x0k/svelte-jsonschema-form/commit/61b8daba452f2490457a2b6f202c81276705efc4))

- Add `tagsField` extra field and `tagsWidget` extra widget definition ([`cff3574`](https://github.com/x0k/svelte-jsonschema-form/commit/cff3574d8921e4fa09fd55c1c60c2e95a4984297))

- Add `extraUiOptions` property to form options ([`1a552e8`](https://github.com/x0k/svelte-jsonschema-form/commit/1a552e8f43c65a3af595f313739200ca97c69e97))

- Add `useDatePickerForDateFormat` function to `fields/extra-widgets/date-picker` ([`768f8c2`](https://github.com/x0k/svelte-jsonschema-form/commit/768f8c206e475dc6acdeaf8a4db7fa8c4ce4d965))

## 2.0.0-next.7

### Major Changes

- Add `label` component ([`b215668`](https://github.com/x0k/svelte-jsonschema-form/commit/b215668587f9add91fc848cc579746303f3ba0f7))

- Add `useLabel` property for the `fieldTemplate` component ([`e8eaae3`](https://github.com/x0k/svelte-jsonschema-form/commit/e8eaae3d332ced78d87748d56dd0f05117ec92d5))

- Remove `forId` from the `errorList` component props ([`f6588ff`](https://github.com/x0k/svelte-jsonschema-form/commit/f6588ff52f88ee9d6f5c1cebdcb80db8b736acea))

- Remove `proxy` function from `lib/svelte.svelte` ([`1138f61`](https://github.com/x0k/svelte-jsonschema-form/commit/1138f616c30cd6e722bef3a037aed08e92033ac9))

- Remove `required` and `forId` from the `title` component props ([`52676ca`](https://github.com/x0k/svelte-jsonschema-form/commit/52676ca7976f6cff6053bba48d73193881b93405))

### Minor Changes

- Pass `widgetType` property to the `fieldTemplate` component ([`749a333`](https://github.com/x0k/svelte-jsonschema-form/commit/749a3333969401b8758f28672585f1ba7a140984))

### Patch Changes

- Fix <https://github.com/x0k/svelte-jsonschema-form/issues/72> ([`f1c6d71`](https://github.com/x0k/svelte-jsonschema-form/commit/f1c6d713afbcee2de58d78770041c674bc3adc1f))

## 2.0.0-next.6

### Patch Changes

- Fixed `enumField` recognition in `compat` resolver ([`6f4942b`](https://github.com/x0k/svelte-jsonschema-form/commit/6f4942b24f754ad99040f35cbaa2285d4d9d7c27))

## 2.0.0-next.5

### Major Changes

- Bump svelte to 5.25.0, relax patch versions of peer dependencies. ([`33fcab1`](https://github.com/x0k/svelte-jsonschema-form/commit/33fcab1e99d3da5d464cbd814b4f8445ceb2e4d9))

### Patch Changes

- Refactor matching logic to improve validation performance and accuracy ([`69535c3`](https://github.com/x0k/svelte-jsonschema-form/commit/69535c3d53fd2d95b2e02d0fe5e6c309aa4d0df6))

## 2.0.0-next.4

### Minor Changes

- The `getValueByPath` function has been returned. ([`f37bf4a`](https://github.com/x0k/svelte-jsonschema-form/commit/f37bf4a9e49eec84bb64b8471ff8f34bc056fdd8))

- Add standard schema form value validator ([`c43eb93`](https://github.com/x0k/svelte-jsonschema-form/commit/c43eb932cbb82b4ba802cd1aff4a35ae2a5f0c88))

- Add function `getRootSchemaTitleByPath` ([`84f9ff9`](https://github.com/x0k/svelte-jsonschema-form/commit/84f9ff9cc15bd252da3967e9dcc1755ffa024e06))

## 2.0.0-next.3

### Major Changes

- The `DefaultFormMerger` class has been replaced by the `createFormMerger` factory. ([#83](https://github.com/x0k/svelte-jsonschema-form/pull/83))

- Remove `AnyKey` type ([#83](https://github.com/x0k/svelte-jsonschema-form/pull/83))

- Remove `getValueByPath` function ([#83](https://github.com/x0k/svelte-jsonschema-form/pull/83))

### Minor Changes

- Add `getSchemaDefinitionByPath` function ([#83](https://github.com/x0k/svelte-jsonschema-form/pull/83))

- Add `getUiSchemaByPath` function ([#83](https://github.com/x0k/svelte-jsonschema-form/pull/83))

- Add options parameter to `createFormMerger` factory ([`0bcf9c6`](https://github.com/x0k/svelte-jsonschema-form/commit/0bcf9c674d9817f4665ef737284ac6e5514055f7))

## 2.0.0-next.2

## 2.0.0-next.1

### Major Changes

- Make `checkboxes` and `file` widgets optional ([#81](https://github.com/x0k/svelte-jsonschema-form/pull/81))

- Move `checkboxes` and `file` widgets to extra folder ([#81](https://github.com/x0k/svelte-jsonschema-form/pull/81))

### Patch Changes

- Fix theme resolver type ([#81](https://github.com/x0k/svelte-jsonschema-form/pull/81))

- Fix type of `fields` resolver ([#81](https://github.com/x0k/svelte-jsonschema-form/pull/81))

## 2.0.0-next.0

### Major Changes

- Remove `lib/deep-equal` submodule ([#78](https://github.com/x0k/svelte-jsonschema-form/pull/78))

- Remove `use-mutation` submodule ([#78](https://github.com/x0k/svelte-jsonschema-form/pull/78))

- Migrate to `resolver` based providers ([#78](https://github.com/x0k/svelte-jsonschema-form/pull/78))

- Remove `legacy-omit-extra-data` submodule ([#78](https://github.com/x0k/svelte-jsonschema-form/pull/78))

- Remove `asSnippet` function ([#78](https://github.com/x0k/svelte-jsonschema-form/pull/78))

- Rename submodule `prevent-data-loss` to `prevent-page-reload` ([#78](https://github.com/x0k/svelte-jsonschema-form/pull/78))

- Migrate to a new `Validator` type model ([#78](https://github.com/x0k/svelte-jsonschema-form/pull/78))

### Minor Changes

- Add `env` lib ([#71](https://github.com/x0k/svelte-jsonschema-form/pull/71))

- Add `css` lib ([#71](https://github.com/x0k/svelte-jsonschema-form/pull/71))

- Add `resolver` lib ([#78](https://github.com/x0k/svelte-jsonschema-form/pull/78))

## 1.9.2

### Patch Changes

- Port https://github.com/rjsf-team/react-jsonschema-form/pull/4461 ([#69](https://github.com/x0k/svelte-jsonschema-form/pull/69))

- Port https://github.com/rjsf-team/react-jsonschema-form/pull/4462 ([#70](https://github.com/x0k/svelte-jsonschema-form/pull/70))

## 1.9.1

### Patch Changes

- Use keyed array inside an array field to preserve items state ([#65](https://github.com/x0k/svelte-jsonschema-form/pull/65))

## 1.9.0

### Minor Changes

- Add omit extra data submodule ([#56](https://github.com/x0k/svelte-jsonschema-form/pull/56))

- Add create action submodule ([#61](https://github.com/x0k/svelte-jsonschema-form/pull/61))

- Add `fake-validator` submodule ([#60](https://github.com/x0k/svelte-jsonschema-form/pull/60))

- Add `FormElement`, `RawForm`, `Form2` components ([#60](https://github.com/x0k/svelte-jsonschema-form/pull/60))

### Patch Changes

- Fix nested additional properties id's inference ([#62](https://github.com/x0k/svelte-jsonschema-form/pull/62))

- Port https://github.com/rjsf-team/react-jsonschema-form/pull/4388 ([#58](https://github.com/x0k/svelte-jsonschema-form/pull/58))

- Port <https://github.com/rjsf-team/react-jsonschema-form/pull/4425> fix ([#59](https://github.com/x0k/svelte-jsonschema-form/pull/59))

## 1.8.0

### Minor Changes

- Add `isSchemaValueDeepEqual` and `isSchemaDeepEqual` functions ([#55](https://github.com/x0k/svelte-jsonschema-form/pull/55))

- Add `createForm3` function ([#54](https://github.com/x0k/svelte-jsonschema-form/pull/54))

  ## Migration
  - Replace `useForm2` with `createForm3`.
  - If custom form is used it should call `setFormContext(form.context)` before using `FormContent` and `SubmitButton` components.

### Patch Changes

- Extract array and object fields logic into their contexts ([#50](https://github.com/x0k/svelte-jsonschema-form/pull/50))

- Bump dev deps ([`a7dd2ce`](https://github.com/x0k/svelte-jsonschema-form/commit/a7dd2ce220f5cef42b154947ad265d5688feee29))

## 1.7.0

### Minor Changes

- Add `constAsDefaults` option to get default form state function. ([#34](https://github.com/x0k/svelte-jsonschema-form/pull/34))

  This is a port of this PR [Adding feature to support const as default bug fix seeming like a regression](https://github.com/rjsf-team/react-jsonschema-form/pull/4381).

- Pass arguments of `mutation.run` to the `onSuccess` and `onFailure` handlers. ([#39](https://github.com/x0k/svelte-jsonschema-form/pull/39))

- Add `lib/memoize` submodule ([#36](https://github.com/x0k/svelte-jsonschema-form/pull/36))

- Implement array and object fields revalidation ([#41](https://github.com/x0k/svelte-jsonschema-form/pull/41))

- Add support for async validation ([#39](https://github.com/x0k/svelte-jsonschema-form/pull/39))

- Add `debounce` and `throttle` mutation combinators ([#39](https://github.com/x0k/svelte-jsonschema-form/pull/39))

### Patch Changes

- Fix `array` based inputs validation ([#40](https://github.com/x0k/svelte-jsonschema-form/pull/40))

- Do not consider `const` in `readonly` attribute calculation. ([#34](https://github.com/x0k/svelte-jsonschema-form/pull/34))

## 1.6.1

### Patch Changes

- Port fix for `getArrayDefaults` ([`753a8bd`](https://github.com/x0k/svelte-jsonschema-form/commit/753a8bde50408a02f6ec5b77e1bc85f9a599fae3))
  - [Bug: Issue with array schema defaults not applying properly when formData is an empty array](https://github.com/rjsf-team/react-jsonschema-form/pull/4359)

## 1.6.0

### Minor Changes

- Add `parent` property to the `SchemaTraverserContext` ([#28](https://github.com/x0k/svelte-jsonschema-form/pull/28))

- Add additional property key validator ([#28](https://github.com/x0k/svelte-jsonschema-form/pull/28))

## 1.5.1

### Patch Changes

- [`d8b4211`](https://github.com/x0k/svelte-jsonschema-form/commit/d8b421173cb2226b82f33a5f78a84c3fca075918) Thanks [@x0k](https://github.com/x0k)! - Fix multi-field selector

  This is not a proper fix (array of multi-fields is still broken) but it's a good place to start.

## 1.5.0

### Minor Changes

- [#26](https://github.com/x0k/svelte-jsonschema-form/pull/26) [`c75aa31`](https://github.com/x0k/svelte-jsonschema-form/commit/c75aa31735b7e5bc27ca4a5203339dd4a43cec3d) Thanks [@x0k](https://github.com/x0k)! - Add `preventDataLoss` function for handling `beforeunload` event

- [#26](https://github.com/x0k/svelte-jsonschema-form/pull/26) [`dad20e1`](https://github.com/x0k/svelte-jsonschema-form/commit/dad20e122cb3cfead93e42acf44ea6a6b9d417ec) Thanks [@x0k](https://github.com/x0k)! - Allow to pass multiple arguments to `mutation.run` method

- [#26](https://github.com/x0k/svelte-jsonschema-form/pull/26) [`a6606d1`](https://github.com/x0k/svelte-jsonschema-form/commit/a6606d1bae97d7c229b6eaed59ce45201e617ebe) Thanks [@x0k](https://github.com/x0k)! - Add form option `pseudoIdSeparator`

### Patch Changes

- [#26](https://github.com/x0k/svelte-jsonschema-form/pull/26) [`34b2481`](https://github.com/x0k/svelte-jsonschema-form/commit/34b2481db20a8c633a0317a41a4b4793ac3946fc) Thanks [@x0k](https://github.com/x0k)! - Changed the value of `DEFAULT_ID_SEPARATOR`

  This change may be a BREAKING change for you if you code implicitly depends on this constant.

- [#26](https://github.com/x0k/svelte-jsonschema-form/pull/26) [`89a3e04`](https://github.com/x0k/svelte-jsonschema-form/commit/89a3e045206de84ab9fc76f0d2c3125ad26ad105) Thanks [@x0k](https://github.com/x0k)! - Remove forced `undefined` for `value` in `onSubmit` handler of the form

- [#26](https://github.com/x0k/svelte-jsonschema-form/pull/26) [`0084022`](https://github.com/x0k/svelte-jsonschema-form/commit/0084022fb6e0c3176f76c8bc9579af8b133ef19b) Thanks [@x0k](https://github.com/x0k)! - Allow to pass a `Map` and `Array` to the `initialErrors` form option

## 1.4.0

### Minor Changes

- [`56a406a`](https://github.com/x0k/svelte-jsonschema-form/commit/56a406a177adcd22b6e468522cfee7c5d483abb4) Thanks [@x0k](https://github.com/x0k)! - Add `isChanged` property to the from state

- [`5ac9c3f`](https://github.com/x0k/svelte-jsonschema-form/commit/5ac9c3f500f050fdafea9712c17fb83915c4b289) Thanks [@x0k](https://github.com/x0k)! - Add `updateErrorsByPath` method to the `FormState`

- [`d0d7d36`](https://github.com/x0k/svelte-jsonschema-form/commit/d0d7d365264828e1daf38eb56db834b04b9f6a03) Thanks [@x0k](https://github.com/x0k)! - Add `submit` and `reset` methods to the `FormState`

- [#24](https://github.com/x0k/svelte-jsonschema-form/pull/24) [`aed9889`](https://github.com/x0k/svelte-jsonschema-form/commit/aed9889350602594187c1e896e2c9dfdc0645030) Thanks [@x0k](https://github.com/x0k)! - Add `useMutation` API

## 1.3.0

### Minor Changes

- [`fe35ad2`](https://github.com/x0k/svelte-jsonschema-form/commit/fe35ad2e4a557e4904a055558f10a86319e4ee79) Thanks [@x0k](https://github.com/x0k)! - Reset form value in default reset handler

- [#22](https://github.com/x0k/svelte-jsonschema-form/pull/22) [`6144b9a`](https://github.com/x0k/svelte-jsonschema-form/commit/6144b9a3583cdf68ba240f663d5d3b6d15cea9d6) Thanks [@x0k](https://github.com/x0k)! - Implement `useForm` API, Add `FormContent` and `SubmitButton` components

- [`13a1beb`](https://github.com/x0k/svelte-jsonschema-form/commit/13a1bebd2ecd6cd84e7b8378aa8a713e7db5365c) Thanks [@x0k](https://github.com/x0k)! - Add `createForm` function

- [`e2c9d61`](https://github.com/x0k/svelte-jsonschema-form/commit/e2c9d61023bef189ee270076776eebc83bef0499) Thanks [@x0k](https://github.com/x0k)! - Allow to augment `InputAttributes` type

### Patch Changes

- [`23f37ab`](https://github.com/x0k/svelte-jsonschema-form/commit/23f37abf7b928bfef45a45ab4a902660a139bfcd) Thanks [@x0k](https://github.com/x0k)! - Port a bunch of fixes for `getDefaultFormState`:
  - [Bug: issue with dependencies computeDefaults](https://github.com/rjsf-team/react-jsonschema-form/pull/4282)
  - [Make fields with const pre-fiiled and readonly](https://github.com/rjsf-team/react-jsonschema-form/pull/4326)
  - [Bug: Deep nested dependencies issue with assigning values to formData](https://github.com/rjsf-team/react-jsonschema-form/pull/4356)

- [`b88b944`](https://github.com/x0k/svelte-jsonschema-form/commit/b88b944629b7b60ea1063c9b580831d0d1676875) Thanks [@x0k](https://github.com/x0k)! - Use the stricter `ComputeDefaultsProps2` type

## 1.2.0

### Patch Changes

- [`c80ec86`](https://github.com/x0k/svelte-jsonschema-form/commit/c80ec86740ca536e948280036e2ecf85164334ca) Thanks [@x0k](https://github.com/x0k)! - Fix reading `title` from `undefined` schema

- [`41980fd`](https://github.com/x0k/svelte-jsonschema-form/commit/41980fd7e8d68b603c8311ada162874724b8e2f1) Thanks [@x0k](https://github.com/x0k)! - Sync dev packages versions

## 1.1.2

### Patch Changes

- [`4f8c576`](https://github.com/x0k/svelte-jsonschema-form/commit/4f8c576d6e666b3e091b3e7581552534eb14dae8) Thanks [@x0k](https://github.com/x0k)! - Fix defaults population for properties from `dependencies`

## 1.1.1

### Patch Changes

- [`985b1ce`](https://github.com/x0k/svelte-jsonschema-form/commit/985b1ceb1f2a4c5db87f29a559be6d0a143073d2) Thanks [@x0k](https://github.com/x0k)! - Simplify `Merger` type

## 1.1.0

### Minor Changes

- [`67ff48c`](https://github.com/x0k/svelte-jsonschema-form/commit/67ff48cab5055a0167bde46b316d5f6f85f79279) Thanks [@x0k](https://github.com/x0k)! - Add `merger` form option

- [`26a1f69`](https://github.com/x0k/svelte-jsonschema-form/commit/26a1f69b52c2b2d4dcf803e7bc3ea35671750af7) Thanks [@x0k](https://github.com/x0k)! - Add `mergeFormDataAndSchemaDefaults` method to `Merger`

### Patch Changes

- [#16](https://github.com/x0k/svelte-jsonschema-form/pull/16) [`81b6952`](https://github.com/x0k/svelte-jsonschema-form/commit/81b69526ac9fd29d10007c25140b954dc1aecfef) Thanks [@x0k](https://github.com/x0k)! - Port fix of `getClosestMatchingOption` to improve the scoring of sub-property objects

  [Original pull request](https://github.com/rjsf-team/react-jsonschema-form/pull/4329)

- [`2e08cd4`](https://github.com/x0k/svelte-jsonschema-form/commit/2e08cd4c52cd42fcb082d16175adb991643699ed) Thanks [@x0k](https://github.com/x0k)! - Make fields of `const` property readonly

## 1.0.0

### Major Changes

- [`49e353f`](https://github.com/x0k/svelte-jsonschema-form/commit/49e353fe6b7578d078155a22e82651f4e9a08fea) Thanks [@x0k](https://github.com/x0k)! - Refactor context API

- [`8d51c45`](https://github.com/x0k/svelte-jsonschema-form/commit/8d51c458acbb3b5299adb2467e47bff78524e895) Thanks [@x0k](https://github.com/x0k)! - Bump deps (Svelte 5)

## 0.2.7

### Patch Changes

- [`080092c`](https://github.com/x0k/svelte-jsonschema-form/commit/080092c53755428e8e9a210ed8e125423c73f7df) Thanks [@x0k](https://github.com/x0k)! - Add `omitExtraData` feature

## 0.2.6

### Patch Changes

- [`607a3c3`](https://github.com/x0k/svelte-jsonschema-form/commit/607a3c3071d5cc8060ae9eb998ab88ee14970dde) Thanks [@x0k](https://github.com/x0k)! - Fix duplication of form field id in widgets with options list

- [`63293f8`](https://github.com/x0k/svelte-jsonschema-form/commit/63293f802c7e92c646addfe3dec69906f7f77217) Thanks [@x0k](https://github.com/x0k)! - Add `getSnapshot` property

## 0.2.5

### Patch Changes

- [`030cf41`](https://github.com/x0k/svelte-jsonschema-form/commit/030cf419388411f57d2bdc5ec8e0305bc4008322) Thanks [@x0k](https://github.com/x0k)! - Fix exports definitions

## 0.2.4

### Patch Changes

- [`2e93326`](https://github.com/x0k/svelte-jsonschema-form/commit/2e93326f73c0a1181ef4abadadc04bf86f778044) Thanks [@x0k](https://github.com/x0k)! - Fix exports definitions

## 0.2.3

## 0.2.2

### Patch Changes

- [`0a4bad3`](https://github.com/x0k/svelte-jsonschema-form/commit/0a4bad3d218bd5d30f14aa9349149dcca42e40f2) Thanks [@x0k](https://github.com/x0k)! - Add `FormBase`, `getDefaultFormState` exports

## 0.2.1

### Patch Changes

- [`2003fcd`](https://github.com/x0k/svelte-jsonschema-form/commit/2003fcdeecb859ec6865c2480f14b353d1c8af7d) Thanks [@x0k](https://github.com/x0k)! - Add icons property

- [`b89983a`](https://github.com/x0k/svelte-jsonschema-form/commit/b89983a095d956f025f6e58546027219ee05678c) Thanks [@x0k](https://github.com/x0k)! - Remove label for range widget

- [`2dd6c35`](https://github.com/x0k/svelte-jsonschema-form/commit/2dd6c352bf6a3018c8ff0593403860260e1a2ee0) Thanks [@x0k](https://github.com/x0k)! - Disable copy button for fixed elements of array

- [`da81bf8`](https://github.com/x0k/svelte-jsonschema-form/commit/da81bf838b24fd4c1edc3c3af01f3afc160b8018) Thanks [@x0k](https://github.com/x0k)! - Fix `root-field` layout gap

- [`339f9be`](https://github.com/x0k/svelte-jsonschema-form/commit/339f9be504d0866fd69a1628adb5dc5739009744) Thanks [@x0k](https://github.com/x0k)! - Fix object property title evaluation

## 0.2.0

### Minor Changes

- [`d36a76c`](https://github.com/x0k/svelte-jsonschema-form/commit/d36a76c157305e4a62eccc710e5b8f45fa13dbe0) Thanks [@x0k](https://github.com/x0k)! - Remove form `readonly` attribute (use `inert` instead)

## 0.1.0

### Minor Changes

- [`ea62b7c`](https://github.com/x0k/svelte-jsonschema-form/commit/ea62b7c8d40d4f8b4e5440c28fd9d81f2201b3ec) Thanks [@x0k](https://github.com/x0k)! - Make default behavior of the form the same as native form

- [`3ce6404`](https://github.com/x0k/svelte-jsonschema-form/commit/3ce640406b1000be4097f2f08f21f63caee191e2) Thanks [@x0k](https://github.com/x0k)! - Implement inputs validation feature

## 0.0.6

### Patch Changes

- [`c0cba76`](https://github.com/x0k/svelte-jsonschema-form/commit/c0cba768c867177b9414c3e79c906bf630e72a76) Thanks [@x0k](https://github.com/x0k)! - Update options mapping, for custom mappers

## 0.0.5

### Patch Changes

- [`34042fa`](https://github.com/x0k/svelte-jsonschema-form/commit/34042fa48212bba5154c60bcdcfa3ffef6d66d82) Thanks [@x0k](https://github.com/x0k)! - Add `focusOnFirstError` feature

## 0.0.4

### Patch Changes

- [`8c337bb`](https://github.com/x0k/svelte-jsonschema-form/commit/8c337bb551090e0ce6af0ded6007fb3c80df8363) Thanks [@x0k](https://github.com/x0k)! - Remove `scheduler-polyfill` due SSR errors

- [`ae990a7`](https://github.com/x0k/svelte-jsonschema-form/commit/ae990a72ace82096e071a5615f477091ec2dc4b5) Thanks [@x0k](https://github.com/x0k)! - Move options mapping helpers to `form` package

- [`f910d77`](https://github.com/x0k/svelte-jsonschema-form/commit/f910d77a5b758edced36b366d025ddf11cf5ce2a) Thanks [@x0k](https://github.com/x0k)! - Add publint

- [`7d0cd8a`](https://github.com/x0k/svelte-jsonschema-form/commit/7d0cd8a1235d330d6d1e1efba2ed5ff8ee273a0a) Thanks [@x0k](https://github.com/x0k)! - Move datalist creation logic to form fields

## 0.0.3

### Patch Changes

- [`6393f13`](https://github.com/x0k/svelte-jsonschema-form/commit/6393f13af1567c6940b1d873936753afb5da68b9) Thanks [@x0k](https://github.com/x0k)! - Remove tests files from bundle

- [`37c116b`](https://github.com/x0k/svelte-jsonschema-form/commit/37c116b64d37f80bb408a6dc3a18952ff8f83dfb) Thanks [@x0k](https://github.com/x0k)! - Remove `unsupported` fields, `alert` component

## 0.0.2

### Patch Changes

- [`f84af68`](https://github.com/x0k/svelte-jsonschema-form/commit/f84af687d8006dd938f1c9dfc339c01396f2ee08) Thanks [@x0k](https://github.com/x0k)! - Update metainformation and release configs
