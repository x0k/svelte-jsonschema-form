import { definitions } from "../../theme/definitions.js";
import UnknownNativeDate from "./unknown-native-date.svelte";
import "./unknown-native-date.svelte";

declare module "../../theme/definitions.js" {
  interface ExtraComponents {
    unknownNativeDateField: {};
  }
}

definitions.unknownNativeDateField = UnknownNativeDate;
