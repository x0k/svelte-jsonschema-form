import type { Logger } from "#core/index.js";

export type LoggerSink = Pick<Console, "warn" | "error">;

export interface LoggerOptions {
  /**
   * Where the messages are written.
   *
   * @default console
   */
  sink?: LoggerSink;
}

/**
 * How many distinct messages a logger remembers before it starts over.
 *
 * A render that produces more distinct messages than this is not deduplicated:
 * no message survives long enough to be seen twice.
 */
const MAX_LOGGED_MESSAGES = 1_000;

function toKey(level: "warn" | "error", message: string, error: unknown) {
  if (error === undefined) {
    return `${level}\u0000${message}`;
  }
  try {
    return `${level}\u0000${message}\u0000${String(error)}`;
  } catch {
    // `error` comes from a `catch`, so its `String()` can throw. Logging must
    // not be what breaks the render; two unconvertible errors under one
    // message cannot be told apart anyway.
    return `${level}\u0000${message}\u0000\u0001${typeof error}`;
  }
}

/** Creates a logger that reports each distinct message once. */
export function createLogger({ sink = console }: LoggerOptions = {}): Logger {
  const logged = new Set<string>();
  function log(level: "warn" | "error", message: string, error?: unknown) {
    const key = toKey(level, message, error);
    if (logged.has(key)) {
      return;
    }
    if (logged.size >= MAX_LOGGED_MESSAGES) {
      logged.clear();
    }
    logged.add(key);
    if (error === undefined) {
      sink[level](message);
    } else {
      sink[level](message, error);
    }
  }
  return {
    warn(message, error) {
      log("warn", message, error);
    },
    error(message, error) {
      log("error", message, error);
    },
  };
}
