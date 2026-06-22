import DOMPurify from "dompurify";
import { createHighlighterCore, type HighlighterCore } from "shiki/core";
// Follows the best practices established in https://shiki.matsu.io/guide/best-performance
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

const bundledLanguages = {
  json: () => import("@shikijs/langs/json"),
  svelte: () => import("@shikijs/langs/svelte"),
  typescript: () => import("@shikijs/langs/typescript"),
  css: () => import("@shikijs/langs/css"),
  html: () => import("@shikijs/langs/html"),
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

function escapeHtml(unsafe: string) {
  return unsafe.replace(/[&<"']/g, function (m) {
    switch (m) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case '"':
        return "&quot;";
      default:
        return "&#039;";
    }
  });
}

export function embedCode(code: string) {
  return DOMPurify.sanitize(`<pre><code>${escapeHtml(code)}</code></pre>`);
}
