import { describe, it, expect } from "vitest";

import { createShadcnLib } from "./shadcn-lib.ts";

const alwaysLib = (_folder: string, libPath: string) => libPath;

describe("createShadcnLib", () => {
  it("includes required components as active", () => {
    const output = createShadcnLib({
      themeOrSubTheme: "shadcn4",
      resolveImportPath: alwaysLib,
      widgets: [],
    })("");

    expect(output).toContain("Button");
    expect(output).toContain("Input");
    expect(output).toContain("Field");
    expect(output).toContain("Select");
  });

  it("all extras commented when widgets is empty", () => {
    const output = createShadcnLib({
      themeOrSubTheme: "shadcn4",
      resolveImportPath: alwaysLib,
      widgets: [],
    })("");

    expect(output).toContain("// Calendar");
    expect(output).toContain("// CommandInput");
    expect(output).toContain("// Slider");
    expect(output).toContain("// Switch");
    expect(output).toContain("// Textarea");
    expect(output).not.toContain("// PasswordRoot");
  });

  it("selected shadcn4 extras are active, others commented", () => {
    const output = createShadcnLib({
      themeOrSubTheme: "shadcn4",
      resolveImportPath: alwaysLib,
      widgets: ["combobox", "textarea"],
    })("");

    expect(output).toContain("Command");
    expect(output).toContain("CommandInput");
    expect(output).toContain("Textarea");
    expect(output).toContain("// Calendar");
    expect(output).toContain("// Slider");
    expect(output).toContain("// Switch");
    expect(output).not.toContain("// Command");
    expect(output).not.toContain("// Textarea");
  });

  it("shadcn-extras widgets have no effect on shadcn4 theme", () => {
    const output = createShadcnLib({
      themeOrSubTheme: "shadcn4",
      resolveImportPath: alwaysLib,
      widgets: ["password", "tags-input"],
    })("");

    expect(output).not.toContain("PasswordRoot");
    expect(output).not.toContain("TagsInput");
  });

  it("selected shadcn-extras extras are active when theme is shadcn-extras", () => {
    const output = createShadcnLib({
      themeOrSubTheme: "shadcn-extras",
      resolveImportPath: alwaysLib,
      widgets: ["password", "tags-input"],
    })("");

    expect(output).toContain("PasswordRoot");
    expect(output).toContain("TagsInput");
    expect(output).not.toContain("// PasswordRoot");
    expect(output).not.toContain("// TagsInput");
  });

  it("includes all shadcn4 extras when theme is shadcn-extras", () => {
    const output = createShadcnLib({
      themeOrSubTheme: "shadcn-extras",
      resolveImportPath: alwaysLib,
      widgets: [],
    })("");

    expect(output).toContain("// Calendar");
    expect(output).toContain("// CommandInput");
    expect(output).toContain("// PasswordRoot");
    expect(output).toContain("// TagsInput");
  });

  it("shadcn4 extras commented when only shadcn-extras widgets selected", () => {
    const output = createShadcnLib({
      themeOrSubTheme: "shadcn-extras",
      resolveImportPath: alwaysLib,
      widgets: ["password"],
    })("");

    expect(output).toContain("PasswordRoot");
    expect(output).not.toContain("// PasswordRoot");
    expect(output).toContain("// Calendar");
    expect(output).toContain("// CommandInput");
  });

  it("returns empty for non-shadcn themes", () => {
    const output = createShadcnLib({
      themeOrSubTheme: "basic",
      resolveImportPath: alwaysLib,
      widgets: [],
    })("");

    expect(output).toBe("");
  });

  it("active extras appear in active import statement", () => {
    const output = createShadcnLib({
      themeOrSubTheme: "shadcn4",
      resolveImportPath: alwaysLib,
      widgets: ["switch"],
    })("");

    expect(output).toMatch(/import \{[\s\S]*?Switch[\s\S]*?\} from/);
  });

  it("active extras appear in components object", () => {
    const output = createShadcnLib({
      themeOrSubTheme: "shadcn4",
      resolveImportPath: alwaysLib,
      widgets: ["switch"],
    })("");

    expect(output).toContain("\t\t\tSwitch\n");
  });

  it("inactive extras do not appear in components object", () => {
    const output = createShadcnLib({
      themeOrSubTheme: "shadcn4",
      resolveImportPath: alwaysLib,
      widgets: [],
    })("");

    expect(output).toContain("// Switch");
  });
});
