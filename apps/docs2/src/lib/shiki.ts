import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { createHighlighterCore, type HighlighterCore } from "shiki/core";

const bundledLanguages = {
  json: () => import("@shikijs/langs/json"),
  svelte: () => import("@shikijs/langs/svelte"),
  typescript: () => import("@shikijs/langs/typescript"),
  bash: () => import("@shikijs/langs/bash"),
  css: () => import("@shikijs/langs/css"),
};

export type SupportedLanguage = keyof typeof bundledLanguages;

export const highlighterPromise = createHighlighterCore({
  themes: [
    import("@shikijs/themes/night-owl"),
    import("@shikijs/themes/night-owl-light"),
  ],
  langs: Object.values(bundledLanguages),
  engine: createJavaScriptRegexEngine(),
});

export function highlight(
  highlighter: HighlighterCore,
  lang: SupportedLanguage,
  code: string
) {
  return highlighter.codeToHtml(code, {
    lang,
    themes: { light: "night-owl-light", dark: "night-owl" },
    transformers: [
      {
        pre: (el) => {
          el.properties.style = "";
          return el;
        },
      },
    ],
  });
}
