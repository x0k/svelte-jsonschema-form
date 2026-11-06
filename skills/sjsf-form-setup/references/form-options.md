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
  initialErrors?: InitialErrors;

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

## Form Values

The form owns its value. Seed it with `initialValue`; SJSF merges schema
defaults into it:

```ts
const form = createForm({
  ...defaults,
  schema,
  initialValue: { username: "alice" },
  onSubmit: (data) => console.log("Valid submit:", data),
});
```

Use the exported commands to change the value after creation:

```ts
import {
  insertArrayItem,
  moveArrayItem,
  removeArrayItem,
  reset,
  setValue,
  setValueAtPath,
  swapArrayItems,
  updateValueAtPath,
} from "@sjsf/form";
import type { SchemaObjectValue } from "@sjsf/form/core";

// Replace the whole value (schema defaults are merged)
setValue(form, { username: "bob" });

// Paths are plain arrays (RPath); the commands cache the FieldPath internally
setValueAtPath(form, ["username"], "alice");

// Mutate an object in place
updateValueAtPath(form, ["profile"], (obj: SchemaObjectValue) => {
  obj.key = "value";
  return obj;
});

// Structural array changes keep item keys in sync
insertArrayItem(form, ["items"], "new item");
removeArrayItem(form, ["items"], 0);
moveArrayItem(form, ["items"], 0, 1);
swapArrayItems(form, ["items"], 0, 1);

// Restore initialValue
reset(form);
```

`insertArrayItem` appends by default; pass the index as the fourth argument to
insert at a specific position.
