export type LogOnceLevel = "warn" | "error";

export const LOG_ONCE_MAX_MESSAGES = 2000;

let currentMessages = new Set<string>();
let previousMessages = new Set<string>();

export default function logOnce(
  message: string,
  level: LogOnceLevel = "warn",
  error?: unknown
) {
  let key: string;
  try {
    key =
      error === undefined
        ? `${level}\u0000${message}`
        : `${level}\u0000${message}\u0000\u0002${String(error)}`;
  } catch {
    key = `${level}\u0000${message}\u0000\u0001${typeof error}`;
  }
  if (currentMessages.has(key) || previousMessages.has(key)) {
    return;
  }
  if (currentMessages.size >= LOG_ONCE_MAX_MESSAGES) {
    previousMessages = currentMessages;
    currentMessages = new Set();
  }
  currentMessages.add(key);
  if (level === "error") {
    if (error === undefined) {
      console.error(message);
    } else {
      console.error(message, error);
    }
  } else if (error === undefined) {
    console.warn(message);
  } else {
    console.warn(message, error);
  }
}

export function resetLogOnce() {
  currentMessages.clear();
  previousMessages.clear();
}
