import type { AbstractPackage } from "../package.ts";

import type { ThemeOrSubTheme } from "../themes.ts";

export interface ComposerOptions {
  themeOrSubTheme: ThemeOrSubTheme;
}

export function createComposer() {
  const dependencies: AbstractPackage[] = [];

  function compose() {
    const files: Record<string, string> = {};
    return files;
  }

  function addDependency(pkg: AbstractPackage) {
    dependencies.push(pkg);
  }

  return {
    compose,
    addDependency,
  };
}
