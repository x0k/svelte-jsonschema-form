import type { PlaygroundValidator } from "./model.ts";

export interface ValidatorState {
  schema: string;
  input: string;
  output: string;
  validator: PlaygroundValidator;
}
