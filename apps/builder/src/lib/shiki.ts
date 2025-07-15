// Follows the best practices established in https://shiki.matsu.io/guide/best-performance
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import DOMPurify from "dompurify";

const bundledLanguages = {
  json: () => import("@shikijs/langs/json"),
  svelte: () => import("@shikijs/langs/svelte"),
  typescript: () => import("@shikijs/langs/typescript"),
  bash: () => import("@shikijs/langs/bash"),
  css: () => import("@shikijs/langs/css"),
};

/** The languages configured for the highlighter */
export type SupportedLanguage = keyof typeof bundledLanguages;

/** A preloaded highlighter instance. */
export const highlighterPromise = createHighlighterCore({
  themes: [
    import("@shikijs/themes/github-light-default"),
    import("@shikijs/themes/github-dark-default"),
  ],
  langs: Object.entries(bundledLanguages).map(([_, lang]) => lang),
  engine: createJavaScriptRegexEngine(),
});

export function highlight(
  highlighter: HighlighterCore,
  lang: SupportedLanguage,
  code: string
) {
  return DOMPurify.sanitize(
    highlighter.codeToHtml(code, {
      lang,
      themes: {
        light: "github-light-default",
        dark: "github-dark-default",
      },
      transformers: [
        {
          pre: (el) => {
            el.properties.style = "";
            return el;
          },
        },
      ],
    })
  );
}
