# SJSF Form Options Reference (`FormOptions<T>`)

Full TypeScript interface options accepted by `createForm(options)`:

```ts
export interface FormOptions<T> {
  // Required
  schema: Schema | (() => Schema);
  theme: Theme | (() => Theme);
  translation: Translation | (() => Translation);
  resolver: (ctx: FormState<T>) => ResolveFieldType;
  idBuilder: Creatable<FormIdBuilder, IdBuilderFactoryOptions>;
  validator: Creatable<Validator, ValidatorFactoryOptions>;
  merger: Creatable<FormMerger, MergerFactoryOptions>;

  // Identification & Styling
  idPrefix?: string; // default: "root"
  icons?: Icons;
  uiSchema?: UiSchemaRoot | (() => UiSchemaRoot);
  extraUiOptions?: ExtraUiOptions;

  // Validation Control
  fieldsValidationMode?: FieldsValidationMode; // Bitmask: input, change, blur
  fieldsValidationDebounceMs?: number; // default: 300
  fieldsValidationDelayedMs?: number; // default: 500
  fieldsValidationTimeoutMs?: number; // default: 8000

  // Form State & Values
  disabled?: boolean | (() => boolean);
  initialValue?: DeepPartial<T>;
  value?: [get: () => T, set: (v: T) => void]; // Controlled form tuple
  initialErrors?: InitialErrors;
  keyedArraysMap?: KeyedArraysMap;

  // Submission Timings & Combinators
  submissionDelayedMs?: number; // default: 500
  submissionTimeoutMs?: number; // default: 8000

  // Event Callbacks
  onSubmit?: (value: T, e: SubmitEvent) => void;
  onSubmitError?: (result: FailureValidationResult, e: SubmitEvent, form: FormState<T>) => void;
  onSubmissionFailure?: (state: FailedTask<unknown>, e: SubmitEvent) => void;
  onFieldsValidationFailure?: (state: FailedTask<unknown>, config: Config, value: FormValue) => void;
  onReset?: (e?: Event) => void;
}
```

---

## Controlled vs Uncontrolled

### Uncontrolled Form (Default, Recommended)
Use `initialValue` and receive valid output in `onSubmit`:
```ts
const form = createForm({
  ...defaults,
  schema,
  initialValue: { username: "alice" },
  onSubmit: (data) => console.log("Valid submit:", data),
});
```

### Controlled Form
Bind a reactive variable using Svelte 5 `$state`:
```svelte
<script lang="ts">
  let formData = $state(merger.mergeFormDataAndSchemaDefaults(initialData, schema));

  const form = createForm({
    ...defaults,
    schema,
    value: [() => formData, (v) => (formData = v)],
  });
</script>
```
Modifying arrays in controlled mode requires either reassignment or using `keyedArraysMap`:
```ts
// 1. Reassignment
formData.items = [...formData.items, newItem];

// 2. Or using keyedArraysMap
const api = keyedArraysMap.get(formData.items);
api?.push(newItem);
```
