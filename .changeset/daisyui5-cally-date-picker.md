---
"@sjsf/daisyui5-theme": major
---

Make the Cally date picker the default `datePickerWidget` and remove the
Pikaday-based date picker.

- `datePickerWidget` now renders the Cally calendar and is imported from
  `@sjsf/daisyui5-theme/extra-widgets/date-picker-include`. The widget stays
  client-only.
- The `daisyui5CallyDatePickerWidget` widget and the
  `cally-date-picker.svelte` / `cally-date-picker-include` entry points are
  removed. Existing Cally users should switch to `datePickerWidget` and
  `date-picker-include`.
- The `daisyui5PikadayCalendar` and `daisyui5PikadayCalendarOptions` UI options
  are removed together with the optional `pikaday` peer dependency. Use the
  Cally options (`daisyui5CallyCalendar*`) instead.
