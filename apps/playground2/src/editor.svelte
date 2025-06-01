<script lang="ts" generics="T">
  import type { HTMLAttributes } from "svelte/elements";
  import { basicSetup } from "codemirror";
  import { json } from "@codemirror/lang-json";
  import { EditorView } from "@codemirror/view";
  import Braces from "@lucide/svelte/icons/braces";
  import { Annotation } from "@codemirror/state";
  import { themeManager } from "./theme.svelte";

  let {
    value = $bindable(),
    class: className,
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
      })
    );
  });
  let error = $state.raw(false);
</script>

<div {...rest} class={[className, "group relative"]} data-error={error}>
  <div
    class="overflow-auto h-full w-full"
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
          EditorView.theme(
            {
              "&": {
                height: "100%",
                display: "flex",
                flexDirection: "column",
              },
            },
            { dark: themeManager.isDark }
          ),
        ],
      });
      return () => view?.destroy();
    }}
  ></div>
  <button
    class="absolute top-2 right-2 z-10 p-1 opacity-0 group-hover:opacity-100 transition rounded-sm bg-slate-300 dark:bg-slate-600"
    onclick={() => {
      if (view === undefined) {
        return;
      }
      view.dispatch(
        view.state.update({
          changes: {
            from: 0,
            to: view.state.doc.length,
            insert: JSON.stringify(value, null, 2),
          },
        })
      );
    }}
  >
    <Braces />
  </button>
</div>
