# 0009. Add Date-valued date/time fields and widgets

## Decision

Add one opt-in string field, `dateField` (`date-include`), that handles the
`date`, `date-time`, `iso-date-time`, `time`, and `iso-time` schema formats
and stores RFC 3339-compliant strings. It selects the shared Date-valued
`dateInputWidget`.

Add `nativeDateField` (`native-date-include`), which uses the same widget but
stores `Date` values directly. Because it is typed for `Date` rather than for
a schema string, a string schema selects it through the `unknown`-typed
`unknownNativeDateField` adapter (`unknown-native-date-include`). The adapter
asserts that the form value is a `Date` and delegates, mirroring
`unknownNativeFileField`.

`schemaValueDateInputType(format)` maps the schema format to the widget's
`inputType`. `dateField` also uses `schemaValueDateAccessors(format)` for the
`get`/`set` pair, while `nativeDateField` stores `Date` directly and needs only
the input type. `dateInputWidget` declares an `inputType` of `date`, `datetime`,
or `time`; the basic theme derives the native input type from it at the widget
edge, so the library type does not use the renderer's `datetime-local`
spelling.

Storage rules for `dateField`:

- `date` is stored as a local calendar day (`YYYY-MM-DD`).
- `date-time` is stored as a UTC RFC 3339 string with seconds. The input shows
  the equivalent local wall-clock time.
- `iso-date-time` keeps the entered wall-clock time and adds no offset.
- `time` gets seconds and the browser's current UTC offset appended.
- `iso-time` gets seconds but no offset.
- Clearing the input clears the value.

The low-level helpers and the format dispatch live in `fields/date-time.ts`.
`fields/extra-widgets/date-input.ts` only declares the widget contract.
`fields/date-time.ts` also exports `dateInputProcessor`, which maps the
widget's `inputType` to a native input type and its converters; the basic and
beercss themes use it for their native `<input>` elements and declare the
shared `dateInput` option in their own `extra-widgets/date-input/options.ts`.

Each theme uses its UI kit's date/time components instead of a native input:

- `basic` and `beercss` render native `<input>` elements and expose the shared
  `dateInput` option.
- `daisyui5` uses Vanilla Calendar Pro for every input type, exposes the shared
  `dateInput` option for the input element and `daisyui5DateInputOptions` for
  the calendar.
- `skeleton5` uses `DatePicker` for `date` and `datetime` and a native time
  input for `time`, exposing `skeleton5DateInput`.
- `flowbite3` uses `Datepicker` for `date` and `datetime` and `Timepicker` for
  `time` and for the time half of a `datetime`, exposing `flowbite3DateInput`
  and `flowbite3TimeInput`.
- `shadcn4` uses the shadcn `Calendar` popover for `date` and `datetime` and the
  shadcn `Input type="time"` for `time`, exposing `shadcn4DateInput`,
  `shadcn4DateInputTrigger`, and `shadcn4DateInputFormatter`.
- `svar` uses `SvarDatePicker` for `date` and `datetime` and `SvarTimePicker`
  for `time`, exposing `svarDateInput` and `svarTimeInput`.

Each theme implements `date`, `time`, and `datetime` as separate widget
components selected by `inputType` in the registered `dateInputWidget`. The
`datetime` component composes the theme's date and time components. The
components live in a `date-input/` subdirectory so the metadata extractors,
which register only top-level `extra-widgets/*.svelte` files, do not treat them
as separate widgets. The widget metadata extractor follows local imports within
a theme's extra-widgets directory, so optional dependencies used by the
components are still attributed to the widget.

Themes whose UI kit has both a date picker and a time control render a
`datetime` as two controls side by side: a date picker first and a time input
second. This applies to `flowbite3`, `skeleton5`, `shadcn4`, and `svar`.
`basic` and `beercss` keep one native `datetime-local` input, and `daisyui5`'s
Vanilla Calendar already combines date and time in one control.

The date control keeps the field id and `name` where the kit renders an input,
so the field label and any label-for association still point at the date half.
The time control gets `${id}-time` as its id and, except for svar's time picker,
as its `name`. The field title names it through `aria-label`, or through the
kit's `title` prop in svar. The shadcn4 date half is a button, as in its
`datePicker`, so it is used with `useLabel: false`.

`flowbite3` uses the kit's `Timepicker` for standalone time and for the time
half of a datetime pair. `Timepicker` only understands `HH:mm`, forces
`"00:00"` when its text is empty or invalid, and does not forward attributes or
handlers. The widget therefore keeps the picker text in local state, syncs it
from the field value, and commits on `onselect`, so the forced `"00:00"` does
not dirty an empty field on mount. Editing drops seconds, the time half has no
`name` or accessible name, and it cannot clear the field.

`replaceDatePart(value, date)` and `replaceTimePart(value, time)` own the
composition rules:

- Replacing one part keeps the other from the previous value.
- A missing part clears the whole value, so clearing either half of a datetime
  pair clears the field. The exception is flowbite3's `Timepicker`, which cannot
  represent an empty value.
- Setting a time when there is no value uses today's date; setting a date when
  there is no value uses the date as-is.

The existing `mergeDateTime` keeps its "absent part means keep the other part"
semantics for the daisyui calendar, which never produces a deliberate
half-clear.

## Why

JSON Schema follows RFC 3339: `time` requires seconds and a timezone offset,
and `date-time` requires seconds and either `Z` or an offset. Native inputs
produce and accept neither an offset nor always seconds. Letting the raw input
value reach the form data makes otherwise valid forms invalid as soon as the
user edits a date/time field.

One field for all five formats avoids duplicated fields and widgets while
keeping the schema-value storage rules in one place. The input type is a
property of the schema format, so the field derives it and passes it to the
widget as a prop. That keeps theme widgets independent of JSON Schema and
prevents every theme from reimplementing the same format switch.

The native variants follow the existing `nativeFileField` naming and are useful
when the form data is consumed as JavaScript values rather than serialized to
JSON. Native values are not JSON, so they bypass the string-format guarantees;
that is an explicit trade-off, not a replacement for the string field.

Making the field opt-in avoids changing the shape of existing form data and
keeps date/time policy out of the foundational `stringField`.

`iso-time`/`iso-date-time` are `ajv-formats` 3 escape hatches for schemas that
want to keep accepting offset-less values. Mapping them to the same native
inputs keeps one widget path while preserving the schema's intent.

Per-format conversions are separate functions instead of boolean flags:
`parseIsoDateTimeSchemaValue` strips the offset while `parseLocalDateTime`
keeps it, and `formatTimeSchemaValue` adds the current offset while
`formatLocalTime` does not. The format dispatch already selects the right
function, so a flag would only add a branch at every call site.

The separate `date`, `time`, and `datetime` components keep each input type's
logic independent while the public contract remains one widget. Editing a
`datetime` as a date only would leave its time part unreachable. The kits that
have both controls already expose a date picker and a time picker, so composing
them side by side is the smallest change that makes the field fully editable.

The explicit clear rule is needed because a "merge" helper cannot distinguish
"this half is absent, keep the other one" from "the user cleared this half".
The two `replace*` helpers encode the deliberate-clear case, while
`mergeDateTime` remains for internal calendar updates and its existing tests.

Flowbite's `Timepicker` limitation is accepted rather than replaced with a
native time input, because the theme exists to use the kit's components. A
native time input would keep seconds and clearing but would not match the rest
of the theme.

## Rejected alternatives

- Separate `dateField`, `dateTimeField`, and `timeField` fields, each with its
  own widget type. They duplicate the field template, handlers, and theme
  widgets and make the field name misleading for schemas that use several
  formats.
- Deriving the native input type inside every theme widget from
  `config.schema.format`. It duplicates the format policy across themes and
  couples presentational widgets to JSON Schema.
- A generic `widgetProps` bag on `field-base.svelte`. It weakens the widget
  contract and was unnecessary once `inputType` became a declared widget prop.
- Three UI-option keys (`date`, `dateTime`, `time`) for the same native input
  widget. The theme widget is one `<input>`; it should have one attribute bag.
- Keep editing a `datetime` as a date and preserve its time. The time part
  becomes unreachable for a user who needs to change it.
- Use a native `datetime-local` input in every theme. It loses each kit's
  styling and interaction, which is what the themed widgets exist for.
- Compose two controls but keep `mergeDateTime` for their setters. Clearing
  the date keeps the stale time, so the field cannot be cleared from the date
  half.
- Use a native `Input type="time"` for flowbite3 instead of `Timepicker`. It
  would keep seconds and clearing, but it is not the kit's time control and
  would diverge from flowbite's styling and interaction.
- Commit daisyui's typed text on `input`. Re-rendering the controlled input
  while the user is still typing normalizes partial values; `change` is the
  first event at which the text is a complete value.
- Selecting the fields from the basic or compat resolver. Resolvers return a
  field type before the consumer has imported the extra field, so every form
  would need the include or resolve a missing component.
- Keeping naive local values and only documenting the limitation. This leaves
  the library producing values that fail format validation and forces every
  consumer to convert on submit.
- Adding the offset without converting `date-time` to UTC. Then the stored
  value would depend on the machine that edited it, and local times from
  different users could not be ordered without extra information.

Related: <https://github.com/rjsf-team/react-jsonschema-form/pull/5270>
