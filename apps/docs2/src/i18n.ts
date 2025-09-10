import { getAbsoluteLocaleUrl } from "astro:i18n";

export const DEFAULT_LOCALE = "en";

export const PLAYGROUND_LINK = getAbsoluteLocaleUrl(
  DEFAULT_LOCALE,
  "/playground3/"
);

export const BUILDER_LINK = getAbsoluteLocaleUrl(DEFAULT_LOCALE, "/builder3/");
