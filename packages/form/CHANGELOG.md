# @sjsf/form

## 2.0.0-next.4

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
