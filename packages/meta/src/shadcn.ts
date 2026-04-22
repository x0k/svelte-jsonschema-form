import { themePackage } from "./themes.ts";
import type { ExtraWidgetFileNames } from "./widgets.ts";

type WidgetComponentsApproximation = Record<
  string,
  ReadonlyArray<string> | Record<string, string>
>;

const BUTTON_COMPONENTS = {
  button: ["Button"],
} as const;

const CHECKBOX_COMPONENTS = {
  checkbox: ["Checkbox"],
} as const;

const INPUT_COMPONENTS = {
  input: ["Input"],
} as const;

const SELECT_COMPONENTS = {
  select: ["Select", "SelectTrigger", "SelectContent", "SelectItem"],
} as const;

const POPOVER_COMPONENTS = {
  popover: ["Popover", "PopoverContent", "PopoverTrigger"],
} as const;

const SLIDER_COMPONENTS = {
  slider: ["Slider"],
} as const;

const REQUIRED_COMPONENTS = {
  // button component
  // submit button component
  ...BUTTON_COMPONENTS,
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
  // checkbox widget
  ...CHECKBOX_COMPONENTS,
  // number widget
  // text widget
  ...INPUT_COMPONENTS,
  // select widget
  ...SELECT_COMPONENTS,
} as const satisfies WidgetComponentsApproximation;

export const shadcnNewYorkThemeSubPath = `${themePackage("shadcn").name}/new-york`;

export function shadcnRequiredComponents(): Iterable<{
  folder: string;
  components: ReadonlyArray<string>;
}> {
  return Object.entries(REQUIRED_COMPONENTS).map(([folder, components]) => ({
    folder,
    components,
  }));
}

const SHADCN4_EXTRA_WIDGET_COMPONENTS = {
  checkboxes: {
    ...CHECKBOX_COMPONENTS,
    field: ["FieldLabel"],
  },
  combobox: {
    ...BUTTON_COMPONENTS,
    ...POPOVER_COMPONENTS,
    command: [
      "Command",
      "CommandInput",
      "CommandList",
      "CommandEmpty",
      "CommandGroup",
      "CommandItem",
    ],
  },
  "date-picker": {
    ...BUTTON_COMPONENTS,
    ...POPOVER_COMPONENTS,
    calendar: ["Calendar"],
  },
  "date-range-picker": {
    ...POPOVER_COMPONENTS,
    "range-calendar": ["RangeCalendar"],
  },
  file: INPUT_COMPONENTS,
  "multi-select": SELECT_COMPONENTS,
  "radio-buttons": {
    "toggle-group": ["ToggleGroup", "ToggleGroupItem"],
  },
  radio: {
    field: ["FieldLabel"],
    "radio-group": ["RadioGroup", "RadioGroupItem"],
  },
  "range-slider": SLIDER_COMPONENTS,
  range: SLIDER_COMPONENTS,
  switch: {
    field: ["FieldLabel"],
    switch: ["Switch"],
  },
  textarea: {
    textarea: ["Textarea"],
  },
} satisfies Record<
  ExtraWidgetFileNames["shadcn4"],
  WidgetComponentsApproximation
>;

const EXTRAS_EXTRA_WIDGET_COMPONENTS = {
  "file-drop-zone": {
    ...BUTTON_COMPONENTS,
    "file-drop-zone": {
      Root: "FileDropZone",
      Trigger: "FileDropZoneTrigger",
    },
  },
  "ip-v4-address-input": {
    "ipv4address-input": ["IPv4AddressInput"],
  },
  "nlp-date-input": {
    "nlp-date-input": ["NLPDateInput"],
  },
  password: {
    password: {
      Root: "PasswordRoot",
      Input: "PasswordInput",
      Strength: "PasswordStrength",
      ToggleVisibility: "PasswordToggleVisibility",
    },
  },
  "phone-input": {
    "phone-input": ["PhoneInput"],
  },
  "star-rating": {
    "star-rating": {
      Root: "StarRatingRoot",
      Star: "StarRatingStar",
    },
  },
  "tags-input": {
    "tags-input": ["TagsInput"],
  },
} satisfies Record<
  ExtraWidgetFileNames["shadcn-extras"],
  WidgetComponentsApproximation
>;
