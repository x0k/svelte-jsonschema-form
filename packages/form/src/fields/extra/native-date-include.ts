import { definitions } from "../../theme/definitions.js";
import NativeDate from "./native-date.svelte";
import "./native-date.svelte";

declare module "../../theme/definitions.js" {
  interface ExtraComponents {
    nativeDateField: {};
  }
}

definitions.nativeDateField = NativeDate;
