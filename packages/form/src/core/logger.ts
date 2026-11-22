/** A sink for the warnings and errors raised by the form, its helpers, and validators. */
export interface Logger {
  warn(message: string, error?: unknown): void;
  error(message: string, error?: unknown): void;
}
