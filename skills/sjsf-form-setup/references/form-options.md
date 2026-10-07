# SJSF Form Options Reference (`FormOptions<T>`)

Full TypeScript interface options accepted by `createForm(options)`.
All options support Svelte 5 reactivity through JS getters
(`get schema() { return schema }`):

```ts
export interface FormOptions<T> {
  // Required
  schema: Schema;
  theme: Theme;
  translation: Translation;
  resolver: (ctx: FormState<T>) => ResolveFieldType;
  idBuilder: Creatable<FormIdBuilder, IdBuilderFactoryOptions>;
  validator: Creatable<FormValidator<T>, ValidatorFactoryOptions>;
  merger: Creatable<FormMerger, MergerFactoryOptions>;

  // Identification & Styling
  idPrefix?: string; // default: "root"
  icons?: Icons;
  uiSchema?: UiSchemaRoot;
  extraUiOptions?: ExtraUiOptions;

  // Validation Control
  // Bitmask of ON_INPUT | ON_CHANGE | ON_BLUR | ON_ARRAY_CHANGE |
  // ON_OBJECT_CHANGE | AFTER_CHANGED | AFTER_TOUCHED | AFTER_SUBMITTED
  // default: 0 (no live validation)
  fieldsValidationMode?: FieldsValidationMode;
  fieldsValidationDebounceMs?: number; // default: 300
  fieldsValidationDelayedMs?: number; // default: 500
  fieldsValidationTimeoutMs?: number; // default: 8000
  fieldsValidationCombinator?: TasksCombinator; // default: abortPrevious
  submissionCombinator?: TasksCombinator; // default: waitPrevious
  validateByRetrievedSchema?: boolean; // deprecated
  schedulerYield?: SchedulerYield;

  // Form State & Values
  disabled?: boolean;
  initialValue?: DeepPartial<T>;
  value?: [get: () => T, set: (v: T) => void]; // Controlled form tuple (Bind<T>)
  initialErrors?: InitialErrors;
  keyedArraysMap?: KeyedArraysMap;

  // Submission Timings & Combinators
  submissionDelayedMs?: number; // default: 500
  submissionTimeoutMs?: number; // default: 8000

  // Event Callbacks
  onSubmit?: (value: T, e: SubmitEvent) => void;
  onSubmitError?: (
    result: FailureValidationResult,
    e: SubmitEvent,
    form: FormState<T>
  ) => void;
  onSubmissionFailure?: (state: FailedTask<unknown>, e: SubmitEvent) => void;
  onFieldsValidationFailure?: (
    state: FailedTask<unknown>,
    config: Config,
    value: FormValue
  ) => void;
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

Bind a reactive variable using Svelte 5 `$state`.
Unlike uncontrolled mode, controlled `value` is used as-is —
defaults from `schema` are NOT auto-merged:

```svelte
<script lang="ts">
  import type { Schema } from "@sjsf/form";

  const schema = {
    type: "object",
    properties: {
      username: { type: "string", default: "alice" },
    },
  } as const satisfies Schema;

  // Define the initial data yourself; no auto-merge happens here.
  const initialData = { username: "bob" };
  let formData = $state(initialData);

  const form = createForm({
    ...defaults,
    schema,
    value: [() => formData, (v) => (formData = v)],
  });
</script>
```

If you need schema defaults merged into a controlled value, prefer
uncontrolled `initialValue` (which auto-merges via
`merger.mergeFormDataAndSchemaDefaults({ formData, schema })`
in `create-form.svelte.ts`). Manual pre-merging requires an instantiated
merger and is not shown here to avoid a no-op copy-paste snippet.
Modifying arrays in controlled mode requires either reassignment or using `keyedArraysMap`:

```ts
// 1. Reassignment
formData.items = [...formData.items, newItem];

// 2. Or using keyedArraysMap
const api = keyedArraysMap.get(formData.items);
api?.push(newItem);
```
