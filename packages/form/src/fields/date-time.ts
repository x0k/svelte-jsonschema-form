// RFC 3339 date/time helpers shared by the extra date/time fields and their
// widgets. The low-level helpers know nothing about JSON Schema formats; the
// schema-value conversions at the bottom map between those formats and `Date`.

// The minutes group is optional to match `ajv-formats`' own offset grammar
// (`[+-]\d\d(?::?\d\d)?`), which accepts an hour-only offset such as `+05`.
// The captured prefix keeps the match off the `-DD` a bare day ends in; a
// capture rather than a lookbehind, which older Safari releases cannot parse.
const TIME_OFFSET_REGEX =
  /(:\d{2}(?:\.\d+)?|\d{4}-\d{2}-\d{2})(?:Z|[+-]\d{2}(?::?\d{2})?)$/i;
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?$/;

/** RFC 3339 allows any number of fractional-second digits; `Date` keeps
 * milliseconds, so extra digits are truncated rather than rejected. */
const MILLISECONDS_LENGTH = 3;

/** Strips a trailing timezone offset (`Z` or `+HH:MM`/`+HH`) from a time or
 * date-time, so it can be handled as wall-clock time. A bare `YYYY-MM-DD` day
 * has no offset and is returned unchanged. */
export function offsetTimeToLocalTime(value: string) {
  return value.replace(TIME_OFFSET_REGEX, "$1");
}

/** Parses a naive local date-time or a bare `YYYY-MM-DD` day. Values with an
 * offset are parsed as the instant they name; strip the offset first to read
 * them as wall-clock time instead. */
export function parseLocalDateTime(
  value: string | null | undefined
): Date | undefined {
  if (!value) {
    return undefined;
  }
  if (DATE_ONLY_REGEX.test(value)) {
    const [year, month, day] = value.split("-").map(Number) as [
      number,
      number,
      number,
    ];
    const date = new Date(1970, 0, 1);
    // The `Date` constructor maps years 0–99 to 1900–1999, but RFC 3339
    // allows them, so set the fields instead of passing them to the
    // constructor.
    date.setFullYear(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/** Parses a local time (`HH:MM`, `HH:MM:SS`, or `HH:MM:SS.sss`) onto a fixed
 * local date. The date is irrelevant to a time-of-day, but a `Date` needs one.
 * Any offset is stripped, since only the time of day is kept. */
export function parseLocalTime(
  value: string | null | undefined
): Date | undefined {
  if (!value) {
    return undefined;
  }
  const match = TIME_REGEX.exec(offsetTimeToLocalTime(value));
  if (match === null) {
    return undefined;
  }
  const [, hours, minutes, seconds = "0", milliseconds = "0"] = match;
  return new Date(
    1970,
    0,
    1,
    Number(hours),
    Number(minutes),
    Number(seconds),
    Number(milliseconds.slice(0, MILLISECONDS_LENGTH).padEnd(3, "0"))
  );
}

/** Formats a `Date` as local wall-clock date-time. Seconds are always present;
 * milliseconds are kept only when they are non-zero. */
export function formatLocalDateTime(date: Date | undefined) {
  const localDate = formatLocalDate(date);
  const localTime = formatLocalTime(date);
  return localDate && localTime ? `${localDate}T${localTime}` : undefined;
}

/** Formats the local wall-clock time of a `Date`. Seconds are always present;
 * milliseconds are kept only when they are non-zero. */
export function formatLocalTime(date: Date | undefined) {
  if (!isValidDate(date)) {
    return undefined;
  }
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${formatSeconds(
    date
  )}`;
}

/** Formats a `Date` for a native `datetime-local` input. Native inputs default
 * to a one-minute step, so zero seconds are omitted and the browser does not
 * render an empty seconds field. */
export function formatLocalInputDateTime(date: Date | undefined) {
  const localDate = formatLocalDate(date);
  const localTime = formatLocalInputTime(date);
  return localDate && localTime ? `${localDate}T${localTime}` : undefined;
}

/** Formats the local time of a `Date` for a native `time` input, omitting zero
 * seconds and zero milliseconds. */
export function formatLocalInputTime(date: Date | undefined) {
  if (!isValidDate(date)) {
    return undefined;
  }
  const prefix = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  if (date.getSeconds() === 0 && date.getMilliseconds() === 0) {
    return prefix;
  }
  return `${prefix}:${formatSeconds(date)}`;
}

/** Combines the calendar day of `date` with the time of day of `time`. */
export function mergeDateTime(
  date: Date | undefined,
  time: Date | undefined
): Date | undefined {
  if (date === undefined) {
    return time;
  }
  if (time === undefined) {
    return date;
  }
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds()
  );
}

/** Replaces only the calendar day of `value`. A missing `date` clears the whole
 * value, which is how a cleared date half of a datetime pair clears the field.
 * The time of day is kept; when there is no previous value, the new date is
 * used as-is. */
export function replaceDatePart(
  value: Date | undefined,
  date: Date | undefined
): Date | undefined {
  if (date === undefined) {
    return undefined;
  }
  if (value === undefined) {
    return date;
  }
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    value.getHours(),
    value.getMinutes(),
    value.getSeconds(),
    value.getMilliseconds()
  );
}

/** Replaces only the time of day of `value`. A missing `time` clears the whole
 * value, which is how a cleared time half of a datetime pair clears the field.
 * When there is no previous value, today's date is used so the result is a
 * valid `Date`. */
export function replaceTimePart(
  value: Date | undefined,
  time: Date | undefined
): Date | undefined {
  if (time === undefined) {
    return undefined;
  }
  const date = value ?? new Date();
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds()
  );
}

/** Formats the browser's current UTC offset as `Z` or `+HH:MM`/`-HH:MM`. */
export function formatTimeZoneOffset() {
  const offsetMinutes = -new Date().getTimezoneOffset();
  if (offsetMinutes === 0) {
    return "Z";
  }
  const sign = offsetMinutes > 0 ? "+" : "-";
  const absoluteMinutes = Math.abs(offsetMinutes);
  return `${sign}${pad(Math.floor(absoluteMinutes / 60))}:${pad(
    absoluteMinutes % 60
  )}`;
}

/** Formats the local calendar date of a `Date` as `YYYY-MM-DD`. */
export function formatLocalDate(date: Date | undefined) {
  if (!isValidDate(date)) {
    return undefined;
  }
  return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
}

function isValidDate(date: Date | undefined): date is Date {
  return date !== undefined && !Number.isNaN(date.getTime());
}

function formatSeconds(date: Date) {
  return date.getMilliseconds()
    ? `${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`
    : pad(date.getSeconds());
}

function pad(value: number, length = 2) {
  return String(value).padStart(length, "0");
}

/** Converts an `iso-date-time` schema value to the `Date` the date/time widget
 * accepts. The value is wall-clock time, so its offset is stripped. */
export function parseIsoDateTimeSchemaValue(
  value: string | null | undefined
): Date | undefined {
  return value ? parseLocalDateTime(offsetTimeToLocalTime(value)) : undefined;
}

/** Converts the `Date` produced by the date/time widget back to a `date-time`
 * schema value. The value is stored as a UTC instant. */
export function formatDateTimeSchemaValue(
  date: Date | undefined
): string | undefined {
  return isValidDate(date) ? date.toISOString() : undefined;
}

/** Converts the `Date` produced by the time widget back to a `time` schema
 * value. The value is local wall-clock time plus the current UTC offset. */
export function formatTimeSchemaValue(
  date: Date | undefined
): string | undefined {
  const time = formatLocalTime(date);
  return time ? `${time}${formatTimeZoneOffset()}` : undefined;
}

export type DateInputType = "date" | "datetime" | "time";

export interface SchemaValueDateAccessors {
  inputType: DateInputType;
  get: (value: string | null | undefined) => Date | undefined;
  set: (date: Date | undefined) => string | undefined;
}

export function schemaValueDateInputType(
  format: string | undefined
): DateInputType {
  switch (format) {
    case "date-time":
    case "iso-date-time":
      return "datetime";
    case "time":
    case "iso-time":
      return "time";
    default:
      return "date";
  }
}

export interface DateInputProcessor {
  nativeType: "date" | "datetime-local" | "time";
  get: (date: Date | undefined) => string | undefined;
  set: (value: string | undefined) => Date | undefined;
  /** Native input step needed to expose seconds for time values. */
  step?: string;
}

/** Maps the widget input type to a native input type and its converters. */
export function dateInputProcessor(
  inputType: DateInputType
): DateInputProcessor {
  switch (inputType) {
    case "date":
      return {
        nativeType: "date",
        get: formatLocalDate,
        set: parseLocalDateTime,
      };
    case "datetime":
      return {
        nativeType: "datetime-local",
        get: formatLocalInputDateTime,
        set: parseLocalDateTime,
        step: "1",
      };
    case "time":
      return {
        nativeType: "time",
        get: formatLocalInputTime,
        set: parseLocalTime,
        step: "1",
      };
  }
}

/** Creates the getter/setter pair that maps a date field's schema value to and
 * from the `Date` its widget accepts. */
export function schemaValueDateAccessors(
  format: string | undefined
): SchemaValueDateAccessors {
  const inputType = schemaValueDateInputType(format);
  switch (format) {
    case "date-time":
      return {
        inputType,
        get: parseLocalDateTime,
        set: formatDateTimeSchemaValue,
      };
    case "iso-date-time":
      return {
        inputType,
        get: parseIsoDateTimeSchemaValue,
        set: formatLocalDateTime,
      };
    case "time":
      return {
        inputType,
        get: parseLocalTime,
        set: formatTimeSchemaValue,
      };
    case "iso-time":
      return {
        inputType,
        get: parseLocalTime,
        set: formatLocalTime,
      };
    default:
      return {
        inputType,
        get: parseLocalDateTime,
        set: formatLocalDate,
      };
  }
}
