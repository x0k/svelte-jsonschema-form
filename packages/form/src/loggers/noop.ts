import type { Logger } from "#core/index.js";
import { noop } from "#lib/function.js";

export const logger: Logger = {
  warn: noop,
  error: noop,
};
