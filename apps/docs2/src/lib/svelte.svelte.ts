import { BROWSER } from "esm-env";
import { on } from "svelte/events";
import { createSubscriber } from "svelte/reactivity";

export function createRef<T>(initialValue: T) {
  let value = $state.raw(initialValue);
  return {
    get current() {
      return value;
    },
    set current(v: T) {
      value = v;
    },
  };
}

class PersistentValue<T> {
  #value: T;
  #subscribe: () => void;

  constructor(
    private readonly key: string,
    private readonly defaultValue: T
  ) {
    this.#value = $state.raw(this.parseValue(localStorage.getItem(key)));
    this.#subscribe = createSubscriber((update) =>
      on(window, "storage", (e) => {
        if (e.key !== key) {
          return;
        }
        this.#value = this.parseValue(e.newValue);
        update();
      })
    );
    window.onstorage;
  }

  get current() {
    this.#subscribe();
    return this.#value;
  }

  set current(v: T) {
    this.#value = v;
    localStorage.setItem(this.key, JSON.stringify(v));
  }

  private parseValue(stored: string | null) {
    return stored === null ? this.defaultValue : JSON.parse(stored);
  }
}

export function createPersistentRef<T>(key: string, defaultValue: T) {
  return BROWSER
    ? new PersistentValue(key, defaultValue)
    : createRef(defaultValue);
}
