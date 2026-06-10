import { createContext } from "svelte";
import * as defaults from "@/lib/sjsf/defaults";

export { defaults };

export const [getDefaultsContext, setDefaultsContext] =
  createContext<typeof defaults>();
