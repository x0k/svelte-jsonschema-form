import { describe, it, expect } from "vitest";
import * as patternsMergers from "./patterns.js";

interface TestCase {
  name: string;
  left: string;
  right: string;
  data: {
    value: string;
    expected: Record<keyof typeof patternsMergers, boolean>;
  }[];
}

const cases: TestCase[] = [
  {
    name: "Basic digit and letter patterns",
    left: "\\d+",
    right: "[a-z]+",
    data: [
      {
        value: "abc123",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "123def",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "abc",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "123",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
    ],
  },
  {
    name: "Uppercase and lowercase letters",
    left: "[A-Z]",
    right: "[a-z]",
    data: [
      {
        value: "Hello",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "HELLO",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "hello",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "HeLLo",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: false,
        },
      },
    ],
  },
  {
    name: "Special characters and digits",
    left: "[!@#$%]",
    right: "\\d",
    data: [
      {
        value: "pass@123",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "password!",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "12345",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "!@#",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "1!",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: false,
        },
      },
    ],
  },
  {
    name: "Word boundaries and exact matches",
    left: "\\bcat\\b",
    right: "\\bdog\\b",
    data: [
      {
        value: "cat and dog",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "catdog",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "the cat runs",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "dog chases cat",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: false,
        },
      },
    ],
  },
  {
    name: "Anchored patterns (should be handled properly)",
    left: "^start",
    right: "end$",
    data: [
      {
        value: "start middle end",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "prefix start middle end",
        expected: {
          // TODO: fix
          simplePatternsMerger: true,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "start middle end suffix",
        expected: {
          // TODO: fix
          simplePatternsMerger: true,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "start end",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: false,
        },
      },
    ],
  },
  {
    name: "Complex patterns with quantifiers",
    left: "\\w{3,}",
    right: "\\d{2,4}",
    data: [
      {
        value: "hello123",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: true,
        },
      },
      {
        value: "hi1",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "word 99",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "test12345",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: true,
        },
      },
    ],
  },
  {
    name: "Email-like patterns",
    left: "@\\w+",
    right: "\\.",
    data: [
      {
        value: "user@example.com",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "user@example",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "example.com",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "test.@domain.org",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: false,
        },
      },
    ],
  },
  {
    name: "Whitespace and non-whitespace patterns",
    left: "\\S+",
    right: "\\s+",
    data: [
      {
        value: "hello world",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "helloworld",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "   ",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "a b c",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: false,
        },
      },
    ],
  },
  {
    name: "Patterns with escaped characters",
    left: "\\(",
    right: "\\)",
    data: [
      {
        value: "(hello)",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "hello",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "()",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "(test",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "test)",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
    ],
  },
  {
    name: "Character classes with numbers and letters",
    left: "[0-9]",
    right: "[a-zA-Z]",
    data: [
      {
        value: "a1",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "1a",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "A9",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "12",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "ab",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
    ],
  },
  {
    name: "Overlapping word and letter patterns",
    left: "\\w+",
    right: "[a-z]+",
    data: [
      {
        value: "hello",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: true,
        },
      },
      {
        value: "Hello123",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: true,
        },
      },
      {
        value: "123",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "HELLO",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "test_case",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: true,
        },
      },
    ],
  },
  {
    name: "Patterns with lookaheads",
    left: "(?=.*test)",
    right: "(?=.*123)",
    data: [
      {
        value: "test123",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: true,
        },
      },
      {
        value: "123test",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: true,
        },
      },
      {
        value: "hello test world 123 end",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: true,
        },
      },
      {
        value: "test",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "123",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
    ],
  },
  {
    name: "Patterns with alternation",
    left: "cat|dog",
    right: "red|blue",
    data: [
      {
        value: "red cat",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "blue dog",
        expected: {
          // TODO: fix
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "cat blue",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "green cat",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "red bird",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
    ],
  },
  {
    name: "Special regex metacharacters",
    left: "\\*\\+",
    right: "\\?\\{\\}",
    data: [
      {
        value: "*+?{}",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "test*+more?{}end",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "*+",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "?{}",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
    ],
  },
  {
    name: "Dot and literal dot patterns",
    left: "\\.",
    right: ".+",
    data: [
      {
        value: "test.example",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: true,
        },
      },
      {
        value: ".",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: true,
        },
      },
      {
        value: "nodot",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: ".txt",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: true,
        },
      },
    ],
  },
  {
    name: "Empty pattern handling",
    left: "",
    right: "\\w+",
    data: [
      {
        value: "test",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: true,
        },
      },
      {
        value: "",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "123",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: true,
        },
      },
    ],
  },
  {
    name: "Password-like complex patterns",
    left: "(?=.*[a-z])(?=.*[A-Z])",
    right: "(?=.*\\d)(?=.*[!@#$%^&*])",
    data: [
      {
        value: "ComplexPassword123!",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: true,
        },
      },
      {
        value: "Password123",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "password123!",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "PASSWORD123!",
        expected: {
          simplePatternsMerger: false,
          legacyPatternsMerger: false,
        },
      },
      {
        value: "Test1@",
        expected: {
          simplePatternsMerger: true,
          legacyPatternsMerger: true,
        },
      },
    ],
  },
];

describe("Pattern Mergers", () => {
  cases.forEach((testCase) => {
    describe(testCase.name, () => {
      testCase.data.forEach((data, index) => {
        Object.entries(patternsMergers).forEach(([mergerName, mergerFn]) => {
          it(`${mergerName} should handle "${data.value}" (case ${index + 1})`, () => {
            const combinedPattern = mergerFn(testCase.left, testCase.right);
            const regex = new RegExp(combinedPattern);
            const result = regex.test(data.value);

            expect(
              result,
              `${mergerName} with patterns "${testCase.left}" + "${testCase.right}" testing "${data.value}"`
            ).toBe(data.expected[mergerName as keyof typeof patternsMergers]);
          });
        });
      });

      // Test that both mergers produce valid regex patterns
      it("should produce valid regex patterns", () => {
        Object.entries(patternsMergers).forEach(([mergerName, mergerFn]) => {
          expect(() => {
            const pattern = mergerFn(testCase.left, testCase.right);
            new RegExp(pattern);
          }, `${mergerName} should produce valid regex pattern for "${testCase.left}" + "${testCase.right}"`).not.toThrow();
        });
      });
    });
  });
});
