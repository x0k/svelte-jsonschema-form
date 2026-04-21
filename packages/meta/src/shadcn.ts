const REQUIRED_COMPONENTS = {
  button: [
    // button component
    // submit button component
    "Button",
  ],
  field: [
    // description component
    // help component
    "FieldDescription",
    // errors list component
    "FieldError",
    // label component
    // checkbox widget
    "FieldLabel",
    // layout component
    "Field",
    // layout component
    "FieldSet",
    // layout component
    "FieldLegend",
    // layout component
    "FieldGroup",
    // title component
    "FieldTitle",
  ],
  "button-group": [
    // layout component
    "ButtonGroup",
  ],
  checkbox: [
    // checkbox widget
    "Checkbox",
  ],
  input: [
    // number widget
    // text widget
    "Input",
  ],
  select: [
    // select widget
    "Select",
    // select widget
    "SelectTrigger",
    // select widget
    "SelectContent",
    // select widget
    "SelectItem",
  ],
} as const satisfies Record<string, string[]>;

export function shadcnRequiredComponents(): Iterable<{
  folder: string;
  components: string[];
}> {
  return Object.entries(REQUIRED_COMPONENTS).map(([folder, components]) => ({
    folder,
    components,
  }));
}
