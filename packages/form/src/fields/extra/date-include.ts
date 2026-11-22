import { definitions } from "../../theme/definitions.js";
import DateField from "./date.svelte";
import "./date.svelte";

declare module "../../theme/definitions.js" {
  interface ExtraComponents {
    dateField: {};
  }
}

definitions.dateField = DateField;
