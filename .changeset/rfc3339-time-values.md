---
"@sjsf/form": major
"@sjsf/basic-theme": major
"@sjsf/daisyui5-theme": major
"@sjsf/flowbite3-theme": major
"@sjsf/skeleton5-theme": major
"@sjsf/shadcn4-theme": major
"@sjsf-lab/beercss-theme": major
"@sjsf-lab/svar-theme": major
---

Add an opt-in `dateField` that stores RFC 3339-compliant values for the
`date`, `date-time`, `iso-date-time`, `time`, and `iso-time` formats, plus
native variants that store `Date` values:

- Import `@sjsf/form/fields/extra/date-include`, then select `dateField` with
  `ui:components`. The widget is a theme extra widget, so also import your
  theme's include (`@sjsf/basic-theme`, `@sjsf-lab/beercss-theme`,
  `@sjsf/daisyui5-theme`, `@sjsf/flowbite3-theme`, `@sjsf/shadcn4-theme`,
  `@sjsf/skeleton5-theme`, or `@sjsf-lab/svar-theme`, each under
  `extra-widgets/date-input-include`). Without it, `dateField` renders
  `component-not-found`.
- `dateField` selects the shared Date-valued `dateInputWidget` and passes an
  `inputType` prop (`date`, `datetime`, or `time`) derived from the schema
  format. Theme widgets map it to their UI kit's date/time components and
  convert between their string value and the field's `Date`.
- `date` values are stored as local calendar days, `date-time` as UTC strings
  with seconds while the input shows local wall-clock time, `iso-date-time`
  without an offset, `time` with seconds and the browser's current UTC offset,
  and `iso-time` with seconds but no offset.
- Clearing an input clears the value. Native time inputs expose seconds with
  `step="1"`, `date-time` years 0000–0099 parse correctly, and fractional
  seconds past millisecond precision are truncated.
- `nativeDateField` from `native-date-include` uses the same widget but stores
  `Date` values directly. Select it from a string schema through the
  `unknownNativeDateField` adapter from `unknown-native-date-include`. The
  adapter asserts `Date` values before delegating. These values are not JSON,
  so they do not satisfy string-format validation.

Themes use their UI kit's date/time components: `basic` and `beercss` keep
native inputs and the shared `dateInput` option; `daisyui5` uses Vanilla
Calendar Pro and exposes the shared `dateInput` option plus
`daisyui5DateInputOptions`; `skeleton5`, `flowbite3`, and `shadcn4` expose
prefixed options for their pickers (`skeleton5DateInput`, `flowbite3DateInput`,
`flowbite3TimeInput`, `shadcn4DateInput`); `svar` exposes `svarDateInput` and
`svarTimeInput`.

`basic` and `beercss` edit a `datetime` through one native `datetime-local`
input, and `daisyui5`'s Vanilla Calendar combines date and time. `flowbite3`,
`skeleton5`, `shadcn4`, and `svar` have separate date and time controls, so
they render a `datetime` as a date picker and a time input side by side. Each
theme implements its date, time, and datetime inputs as separate components
selected by `inputType` in the same `dateInputWidget`. The date half keeps the
field id and `name` where the kit renders an input; `shadcn4`'s trigger is a
button, so its specs use `useLabel: false`. The time half gets `${id}-time` and
the field title as its accessible name when the kit forwards attributes.
Clearing either half clears the whole value.

`flowbite3`'s time control is the kit's `Timepicker`, configured through
`flowbite3TimeInput` (`TimepickerProps`). It keeps its text in local state and
commits on selection, so its forced `"00:00"` does not dirty an empty field on
mount. `Timepicker` only accepts `HH:mm` and does not forward attributes,
handlers, or an empty value, so editing drops seconds, the time half has no
`name` or accessible name, and flowbite's time half cannot clear the field.
`daisyui5` commits typed text on native `change` rather than `input`, so the
value is not normalized while the user is still typing; its `dateInput` specs
therefore do not advertise `oninput` validation.

The default `stringField` and native inputs keep storing the raw input string,
so existing forms are unchanged. `iso-time` and `iso-date-time` are now also
recognized by `inputType()` and map to the same native inputs as `time` and
`date-time`.

Previously stored offset-less `time` values do not match the RFC 3339 `time`
format. Re-save them to pick up an offset, backfill them, or use `iso-time` for
fields that must keep accepting them.
