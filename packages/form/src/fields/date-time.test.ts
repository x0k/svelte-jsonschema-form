import { describe, expect, it } from "vitest";

import {
  dateInputProcessor,
  formatDateTimeSchemaValue,
  formatLocalDate,
  formatLocalDateTime,
  formatLocalInputDateTime,
  formatLocalInputTime,
  formatLocalTime,
  formatTimeSchemaValue,
  formatTimeZoneOffset,
  offsetTimeToLocalTime,
  parseIsoDateTimeSchemaValue,
  parseLocalDateTime,
  parseLocalTime,
  replaceDatePart,
  replaceTimePart,
  schemaValueDateAccessors,
  schemaValueDateInputType,
} from "./date-time.js";

describe("offsetTimeToLocalTime", () => {
  it("strips every offset form accepted by `ajv-formats`", () => {
    expect(offsetTimeToLocalTime("12:34:56Z")).toBe("12:34:56");
    expect(offsetTimeToLocalTime("12:34:56+05:30")).toBe("12:34:56");
    expect(offsetTimeToLocalTime("12:34:56-05:30")).toBe("12:34:56");
    expect(offsetTimeToLocalTime("12:34:56+05")).toBe("12:34:56");
    expect(offsetTimeToLocalTime("12:34:56+0530")).toBe("12:34:56");
    expect(offsetTimeToLocalTime("2024-01-01T12:34:56+05:00")).toBe(
      "2024-01-01T12:34:56"
    );
  });

  it("leaves values without an offset unchanged", () => {
    expect(offsetTimeToLocalTime("12:34:56")).toBe("12:34:56");
    expect(offsetTimeToLocalTime("2024-01-01")).toBe("2024-01-01");
  });
});

describe("parseLocalDateTime", () => {
  it("parses a naive date-time as local time", () => {
    const date = parseLocalDateTime("2024-01-01T12:34:56")!;
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(1);
    expect(date.getHours()).toBe(12);
    expect(date.getMinutes()).toBe(34);
    expect(date.getSeconds()).toBe(56);
  });

  it("parses a bare day as the start of that local day", () => {
    const date = parseLocalDateTime("2024-01-01")!;
    expect(date.getHours()).toBe(0);
    expect(date.getMinutes()).toBe(0);
    expect(date.getSeconds()).toBe(0);
  });

  it("parses years 0000-0099 without mapping them to 1900-1999", () => {
    const year0 = parseLocalDateTime("0000-01-01")!;
    expect([year0.getFullYear(), year0.getMonth(), year0.getDate()]).toEqual([
      0, 0, 1,
    ]);
    const year99 = parseLocalDateTime("0099-12-31")!;
    expect([year99.getFullYear(), year99.getMonth(), year99.getDate()]).toEqual(
      [99, 11, 31]
    );
  });

  it("parses an offset as the instant it names", () => {
    expect(parseLocalDateTime("2024-01-01T12:00:00Z")!.toISOString()).toBe(
      "2024-01-01T12:00:00.000Z"
    );
    expect(parseLocalDateTime("2024-01-01T12:00:00+05:00")!.toISOString()).toBe(
      "2024-01-01T07:00:00.000Z"
    );
  });

  it("returns undefined for an empty or invalid value", () => {
    expect(parseLocalDateTime(undefined)).toBeUndefined();
    expect(parseLocalDateTime("")).toBeUndefined();
    expect(parseLocalDateTime("not a date")).toBeUndefined();
  });
});

describe("parseLocalTime", () => {
  it("parses hours and minutes, seconds, and milliseconds", () => {
    const minutes = parseLocalTime("12:34")!;
    expect([
      minutes.getHours(),
      minutes.getMinutes(),
      minutes.getSeconds(),
    ]).toEqual([12, 34, 0]);

    const seconds = parseLocalTime("12:34:56")!;
    expect(seconds.getSeconds()).toBe(56);

    const milliseconds = parseLocalTime("12:34:56.789")!;
    expect(milliseconds.getMilliseconds()).toBe(789);
  });

  it("truncates fractional seconds past millisecond precision", () => {
    expect(parseLocalTime("12:34:56.123456789")!.getMilliseconds()).toBe(123);
    expect(parseLocalTime("12:34:56.1")!.getMilliseconds()).toBe(100);
  });

  it("strips an offset", () => {
    const date = parseLocalTime("12:34:56-05:00")!;
    expect([date.getHours(), date.getMinutes(), date.getSeconds()]).toEqual([
      12, 34, 56,
    ]);
  });

  it("returns undefined for an empty or invalid value", () => {
    expect(parseLocalTime(undefined)).toBeUndefined();
    expect(parseLocalTime("")).toBeUndefined();
    expect(parseLocalTime("not a time")).toBeUndefined();
  });
});

describe("formatLocalDate", () => {
  it("formats a local calendar day", () => {
    expect(formatLocalDate(new Date(2024, 0, 1, 12, 34, 56))).toBe(
      "2024-01-01"
    );
  });

  it("returns undefined for an empty or invalid date", () => {
    expect(formatLocalDate(undefined)).toBeUndefined();
    expect(formatLocalDate(new Date(Number.NaN))).toBeUndefined();
  });
});

describe("formatLocalDateTime", () => {
  it("formats local wall-clock time with seconds", () => {
    expect(formatLocalDateTime(new Date(2024, 0, 1, 12, 34, 56))).toBe(
      "2024-01-01T12:34:56"
    );
  });

  it("keeps non-zero milliseconds", () => {
    expect(formatLocalDateTime(new Date(2024, 0, 1, 12, 34, 56, 789))).toBe(
      "2024-01-01T12:34:56.789"
    );
  });

  it("returns undefined for an empty or invalid date", () => {
    expect(formatLocalDateTime(undefined)).toBeUndefined();
    expect(formatLocalDateTime(new Date(Number.NaN))).toBeUndefined();
  });
});

describe("formatLocalInputDateTime", () => {
  it("omits zero seconds for a native input", () => {
    expect(formatLocalInputDateTime(new Date(2024, 0, 1, 12, 34))).toBe(
      "2024-01-01T12:34"
    );
  });

  it("keeps non-zero seconds and milliseconds", () => {
    expect(formatLocalInputDateTime(new Date(2024, 0, 1, 12, 34, 56))).toBe(
      "2024-01-01T12:34:56"
    );
    expect(
      formatLocalInputDateTime(new Date(2024, 0, 1, 12, 34, 56, 789))
    ).toBe("2024-01-01T12:34:56.789");
  });
});

describe("formatLocalTime", () => {
  it("formats local time with seconds", () => {
    expect(formatLocalTime(new Date(2024, 0, 1, 12, 34, 56))).toBe("12:34:56");
  });

  it("keeps non-zero milliseconds", () => {
    expect(formatLocalTime(new Date(2024, 0, 1, 12, 34, 56, 789))).toBe(
      "12:34:56.789"
    );
  });
});

describe("formatLocalInputTime", () => {
  it("omits zero seconds for a native input", () => {
    expect(formatLocalInputTime(new Date(1970, 0, 1, 12, 34))).toBe("12:34");
  });

  it("keeps non-zero seconds and milliseconds", () => {
    expect(formatLocalInputTime(new Date(1970, 0, 1, 12, 34, 56))).toBe(
      "12:34:56"
    );
    expect(formatLocalInputTime(new Date(1970, 0, 1, 12, 34, 56, 789))).toBe(
      "12:34:56.789"
    );
  });
});

describe("formatTimeZoneOffset", () => {
  it("matches the browser's current UTC offset", () => {
    const offsetMinutes = -new Date().getTimezoneOffset();
    if (offsetMinutes === 0) {
      expect(formatTimeZoneOffset()).toBe("Z");
      return;
    }
    const absoluteMinutes = Math.abs(offsetMinutes);
    const sign = offsetMinutes > 0 ? "+" : "-";
    const hours = String(Math.floor(absoluteMinutes / 60)).padStart(2, "0");
    const minutes = String(absoluteMinutes % 60).padStart(2, "0");
    expect(formatTimeZoneOffset()).toBe(`${sign}${hours}:${minutes}`);
  });
});

describe("parseIsoDateTimeSchemaValue", () => {
  it("reads `iso-date-time` as the wall-clock time it names", () => {
    const date = parseIsoDateTimeSchemaValue("2024-01-01T12:00:00+05:00")!;
    expect([
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
    ]).toEqual([2024, 0, 1, 12]);
  });

  it("reads a bare `iso-date-time` day as the start of that day", () => {
    const date = parseIsoDateTimeSchemaValue("2024-01-01")!;
    expect([date.getHours(), date.getMinutes(), date.getSeconds()]).toEqual([
      0, 0, 0,
    ]);
  });

  it("returns undefined for empty and invalid values", () => {
    expect(parseIsoDateTimeSchemaValue(undefined)).toBeUndefined();
    expect(parseIsoDateTimeSchemaValue("")).toBeUndefined();
    expect(parseIsoDateTimeSchemaValue("not a date")).toBeUndefined();
  });
});

describe("formatDateTimeSchemaValue", () => {
  it("stores `date-time` as UTC", () => {
    const date = new Date(2024, 0, 1, 12, 34, 56);
    expect(formatDateTimeSchemaValue(date)).toBe(date.toISOString());
  });

  it("returns undefined for an empty or invalid date", () => {
    expect(formatDateTimeSchemaValue(undefined)).toBeUndefined();
    expect(formatDateTimeSchemaValue(new Date(Number.NaN))).toBeUndefined();
  });
});

describe("formatTimeSchemaValue", () => {
  it("stores `time` with the current UTC offset", () => {
    expect(formatTimeSchemaValue(new Date(1970, 0, 1, 12, 34, 56))).toBe(
      `12:34:56${formatTimeZoneOffset()}`
    );
  });

  it("returns undefined for an empty or invalid date", () => {
    expect(formatTimeSchemaValue(undefined)).toBeUndefined();
    expect(formatTimeSchemaValue(new Date(Number.NaN))).toBeUndefined();
  });
});

describe("schemaValueDateInputType", () => {
  it("dispatches on the schema format", () => {
    expect(schemaValueDateInputType("date")).toBe("date");
    expect(schemaValueDateInputType("date-time")).toBe("datetime");
    expect(schemaValueDateInputType("iso-date-time")).toBe("datetime");
    expect(schemaValueDateInputType("time")).toBe("time");
    expect(schemaValueDateInputType("iso-time")).toBe("time");
  });

  it("treats unknown and missing formats as `date`", () => {
    expect(schemaValueDateInputType(undefined)).toBe("date");
    expect(schemaValueDateInputType("custom")).toBe("date");
  });
});

describe("schemaValueDateAccessors", () => {
  it("treats unknown and missing formats as `date`", () => {
    for (const format of [undefined, "custom"]) {
      const { inputType, get } = schemaValueDateAccessors(format);
      expect(inputType).toBe("date");
      const date = get("2024-01-01")!;
      expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([
        2024, 0, 1,
      ]);
    }
  });

  it("round-trips every schema format", () => {
    const date = new Date(2024, 0, 1, 12, 34, 56);
    for (const format of ["date", "date-time", "iso-date-time"]) {
      const accessors = schemaValueDateAccessors(format);
      expect(accessors.get(accessors.set(date))).toEqual(
        format === "date" ? new Date(2024, 0, 1) : date
      );
    }

    const time = new Date(1970, 0, 1, 12, 34, 56);
    for (const format of ["time", "iso-time"]) {
      const accessors = schemaValueDateAccessors(format);
      const roundTrip = accessors.get(accessors.set(time))!;
      expect([
        roundTrip.getHours(),
        roundTrip.getMinutes(),
        roundTrip.getSeconds(),
      ]).toEqual([12, 34, 56]);
    }
  });
});

describe("schema and Date round trip", () => {
  it("round-trips `iso-date-time` without an offset", () => {
    const value = "2024-01-01T12:34:56";
    expect(formatLocalDateTime(parseIsoDateTimeSchemaValue(value))).toBe(value);
  });

  it("round-trips `iso-time` without an offset", () => {
    const value = "12:34:56";
    expect(formatLocalTime(parseLocalTime(value))).toBe(value);
  });
});

describe("replaceDatePart", () => {
  it("keeps the time of day when the date changes", () => {
    const value = new Date(2024, 0, 1, 12, 34, 56, 789);
    expect(replaceDatePart(value, new Date(2024, 1, 2))).toEqual(
      new Date(2024, 1, 2, 12, 34, 56, 789)
    );
  });

  it("uses the new date as-is when there was no value", () => {
    const date = new Date(2024, 1, 2);
    expect(replaceDatePart(undefined, date)).toEqual(date);
  });

  it("clears the whole value when the date is cleared", () => {
    expect(
      replaceDatePart(new Date(2024, 0, 1, 12, 34), undefined)
    ).toBeUndefined();
  });
});

describe("replaceTimePart", () => {
  it("keeps the calendar day when the time changes", () => {
    const value = new Date(2024, 0, 1, 12, 34, 56, 789);
    expect(replaceTimePart(value, new Date(1970, 0, 1, 23, 59))).toEqual(
      new Date(2024, 0, 1, 23, 59)
    );
  });

  it("uses today's date when there was no value", () => {
    const now = new Date();
    const result = replaceTimePart(undefined, new Date(1970, 0, 1, 12, 34))!;
    expect([result.getFullYear(), result.getMonth(), result.getDate()]).toEqual(
      [now.getFullYear(), now.getMonth(), now.getDate()]
    );
    expect([result.getHours(), result.getMinutes()]).toEqual([12, 34]);
  });

  it("clears the whole value when the time is cleared", () => {
    expect(
      replaceTimePart(new Date(2024, 0, 1, 12, 34), undefined)
    ).toBeUndefined();
  });
});

describe("dateInputProcessor", () => {
  it("maps the library input type to the native input type", () => {
    expect(dateInputProcessor("date").nativeType).toBe("date");
    expect(dateInputProcessor("datetime").nativeType).toBe("datetime-local");
    expect(dateInputProcessor("time").nativeType).toBe("time");
  });

  it("formats a local calendar day", () => {
    expect(dateInputProcessor("date").get(new Date(2024, 0, 1, 12, 34))).toBe(
      "2024-01-01"
    );
  });

  it("formats local wall-clock time and keeps milliseconds", () => {
    const processor = dateInputProcessor("datetime");
    expect(processor.get(new Date(2024, 0, 1, 12, 34))).toBe(
      "2024-01-01T12:34"
    );
    expect(processor.get(new Date(2024, 0, 1, 12, 34, 56))).toBe(
      "2024-01-01T12:34:56"
    );
    expect(processor.get(new Date(2024, 0, 1, 12, 34, 56, 789))).toBe(
      "2024-01-01T12:34:56.789"
    );
  });

  it("formats local time and keeps milliseconds", () => {
    const processor = dateInputProcessor("time");
    expect(processor.get(new Date(1970, 0, 1, 12, 34))).toBe("12:34");
    expect(processor.get(new Date(1970, 0, 1, 12, 34, 56))).toBe("12:34:56");
    expect(processor.get(new Date(1970, 0, 1, 12, 34, 56, 789))).toBe(
      "12:34:56.789"
    );
  });

  it("parses a local calendar day", () => {
    const date = dateInputProcessor("date").set("2024-01-01")!;
    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([
      2024, 0, 1,
    ]);
  });

  it("parses the local wall-clock string as a local date", () => {
    const date = dateInputProcessor("datetime").set("2024-01-01T12:34:56")!;
    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([
      2024, 0, 1,
    ]);
    expect([date.getHours(), date.getMinutes(), date.getSeconds()]).toEqual([
      12, 34, 56,
    ]);
  });

  it("parses the time onto a fixed local date", () => {
    const date = dateInputProcessor("time").set("12:34")!;
    expect([date.getHours(), date.getMinutes(), date.getSeconds()]).toEqual([
      12, 34, 0,
    ]);
  });

  it("round-trips every input type", () => {
    const date = new Date(2024, 0, 1, 12, 34, 56);
    const dateProcessor = dateInputProcessor("date");
    expect(dateProcessor.set(dateProcessor.get(date))).toEqual(
      new Date(2024, 0, 1)
    );
    const dateTimeProcessor = dateInputProcessor("datetime");
    expect(dateTimeProcessor.set(dateTimeProcessor.get(date))).toEqual(date);
    const time = new Date(1970, 0, 1, 12, 34, 56);
    const timeProcessor = dateInputProcessor("time");
    expect(timeProcessor.set(timeProcessor.get(time))).toEqual(time);
  });

  it("returns undefined for an empty or invalid value", () => {
    for (const inputType of ["date", "datetime", "time"] as const) {
      const processor = dateInputProcessor(inputType);
      expect(processor.get(undefined)).toBeUndefined();
      expect(processor.set(undefined)).toBeUndefined();
    }
    expect(dateInputProcessor("date").set("not a date")).toBeUndefined();
    expect(dateInputProcessor("datetime").set("not a date")).toBeUndefined();
    expect(dateInputProcessor("time").set("not a time")).toBeUndefined();
  });
});
