<script lang="ts" generics="T">
  import type { HTMLAttributes } from "svelte/elements";
  import { basicSetup } from "codemirror";
  import { json } from "@codemirror/lang-json";
  import { EditorView } from "@codemirror/view";
  import { Annotation } from "@codemirror/state";
  import { githubLight } from "@ddietr/codemirror-themes/github-light";
  import { githubDark } from "@ddietr/codemirror-themes/github-dark";

  import { themeManager } from "./theme.svelte";

  let {
    value = $bindable(),
    ...rest
  }: {
    value: T;
  } & HTMLAttributes<HTMLDivElement> = $props();

  let view = $state.raw<EditorView>();
  let ignore = false;
  const ExternalChange = Annotation.define();
  $effect(() => {
    if (view === undefined) {
      return;
    }
    if (ignore) {
      value;
      ignore = false;
      return;
    }
    view.dispatch(
      view.state.update({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: JSON.stringify(value, null, 2),
        },
        annotations: ExternalChange.of(true),
      }),
    );
  });
  let error = $state.raw(false);

  export function format() {
    if (view === undefined || error) {
      return;
    }
    view.dispatch(
      view.state.update({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: JSON.stringify(value, null, 2),
        },
      }),
    );
  }
</script>

<div
  class="h-full"
  {@attach (node) => {
    const onChange = EditorView.updateListener.of((update) => {
      if (
        !update.docChanged ||
        update.transactions.some((t) => t.annotation(ExternalChange))
      ) {
        return;
      }
      const str = update.state.doc.toString();
      try {
        value = JSON.parse(str);
        ignore = true;
        error = false;
      } catch (e) {
        error = true;
      }
    });
    ignore = false;
    view = new EditorView({
      parent: node,
      extensions: [
        basicSetup,
        json(),
        onChange,
        themeManager.isDark ? githubDark : githubLight,
        EditorView.theme(
          {
            "&": {
              height: "100%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "transparent !important",
            },
            ".cm-gutters": {
              backgroundColor: "var(--background) !important",
            },
          },
          { dark: themeManager.isDark },
        ),
      ],
    });
    return () => view?.destroy();
  }}
></div>
