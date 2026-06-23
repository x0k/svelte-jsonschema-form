<script lang="ts">
  import { css } from "@codemirror/lang-css";
  import { javascript } from "@codemirror/lang-javascript";
  import { Annotation } from "@codemirror/state";
  import { EditorView } from "@codemirror/view";
  import { githubDark } from "@ddietr/codemirror-themes/github-dark";
  import { githubLight } from "@ddietr/codemirror-themes/github-light";
  import { basicSetup } from "codemirror";
  import { untrack } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import type { Lang } from "@/shared.svelte";
  import { themeManager } from "@/theme.svelte";

  let {
    value = $bindable(),
    lang = "javascript",
    ...rest
  }: HTMLAttributes<HTMLDivElement> & {
    value: string;
    lang?: Lang;
  } = $props();

  let view = $state.raw<EditorView>();

  const ExternalChange = Annotation.define();
  let ignore = false;

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
          insert: value,
        },
        annotations: ExternalChange.of(true),
      })
    );
  });
</script>

<div
  {...rest}
  {@attach (node) => {
    const onChange = EditorView.updateListener.of((update) => {
      if (
        !update.docChanged ||
        update.transactions.some((t) => t.annotation(ExternalChange))
      ) {
        return;
      }
      ignore = true;
      value = update.state.doc.toString();
    });
    view = new EditorView({
      parent: node,
      doc: untrack(() => value),
      extensions: [
        basicSetup,
        lang === "css" ? css() : javascript(),
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
          { dark: themeManager.isDark }
        ),
      ],
    });
    return () => view?.destroy();
  }}
></div>
