import type { Get } from "@/lib/types";

export interface Labels {
  submit: [];
  "unknown-field-type": [type: string];
}

export type Label = keyof Labels;

export type Translator = <L extends Label>(
  label: L,
  ...params: Get<Labels, L, []>
) => string;
