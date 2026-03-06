import { createSubscriber } from "svelte/reactivity";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

export type Page = "" | "v" | "m";

const DEFAULT_PAGE = "";
const PAGES = new Set<string>([DEFAULT_PAGE, "v", "m"] satisfies Page[]);

class Router {
  #update: (() => void) | undefined;

  #subscribe = createSubscriber((update) => {
    this.#update = update;
    window.addEventListener("popstate", update);
    return () => {
      this.#update = undefined;
      window.removeEventListener("popstate", update);
    };
  });

  get page(): Page {
    this.#subscribe();
    const page =
      new URLSearchParams(window.location.search).get("page") ?? DEFAULT_PAGE;
    return PAGES.has(page) ? (page as Page) : DEFAULT_PAGE;
  }

  navigate(page: Page, data: any = undefined) {
    const url = new URL(window.location.href);
    url.search = "";
    if (page) {
      url.searchParams.set("page", page);
    }
    url.hash = data ? compressToEncodedURIComponent(JSON.stringify(data)) : "";
    history.pushState(null, "", url);
    this.#update?.();
  }

  store<T extends Record<string, any>>(data: T) {
    const url = new URL(window.location.href);
    url.hash = compressToEncodedURIComponent(JSON.stringify(data));
    history.replaceState(null, "", url);
  }

  load<T extends Record<string, any>>(defaultData: T): T {
    const hash = window.location.hash;
    if (!hash) {
      return defaultData;
    }
    try {
      return Object.assign(
        {},
        defaultData,
        JSON.parse(decompressFromEncodedURIComponent(hash.substring(1))),
      );
    } catch {
      console.error("Failed to decode state from URL");
      return defaultData;
    }
  }

  back() {
    // triggers `popstate`
    history.back();
  }
}

export const router = new Router();
