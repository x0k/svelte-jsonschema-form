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

Show a required marker on checkboxes whose schema only allows `true` (`const: true` or `enum: [true]`), because such a checkbox must be checked to submit the form, unlike a plain required boolean field.

`checkboxWidget` now receives a required `mustBeChecked` prop computed by `booleanField`. Custom themes must render the marker and set the native `required` attribute only when `mustBeChecked` is `true`, not merely when `config.required` is set.
