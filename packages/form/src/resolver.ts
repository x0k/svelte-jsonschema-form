import { chain } from "./lib/resolver.js";
import { fields } from "./fields/resolver/index.js";
import { templates } from "./templates/resolver/index.js";

export const resolver = chain(fields, templates);
