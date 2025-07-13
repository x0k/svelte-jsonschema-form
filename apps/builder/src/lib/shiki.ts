// Follows the best practices established in https://shiki.matsu.io/guide/best-performance
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { createHighlighterCore } from "shiki/core";
import DOMPurify from "dompurify";

const bundledLanguages = {
  json: () => import("@shikijs/langs/json"),
  svelte: () => import("@shikijs/langs/svelte"),
  typescript: () => import("@shikijs/langs/typescript"),
};

/** The languages configured for the highlighter */
export type SupportedLanguage = keyof typeof bundledLanguages;

/** A preloaded highlighter instance. */
const highlighter = await createHighlighterCore({
  themes: [
    import("@shikijs/themes/github-light-default"),
    import("@shikijs/themes/github-dark-default"),
  ],
  langs: Object.entries(bundledLanguages).map(([_, lang]) => lang),
  engine: createJavaScriptRegexEngine(),
});

export function highlight(lang: SupportedLanguage, code: string) {
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
