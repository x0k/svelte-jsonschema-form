<script lang="ts" module>
  const JSON_CONSTANTS = new Set(["true", "false", "null"]);
</script>

<script lang="ts">
  import { untrack } from "svelte";
  import { identity } from "@sjsf/form/lib/function";
  import Plus from "@lucide/svelte/icons/plus";

  import {
    isEnumItemNode,
    createEnumItemNode,
    EnumValueType,
    type EnumItemNode,
  } from "$lib/builder/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Button } from "$lib/components/ui/button/index.js";

  import { getBuilderContext } from "../../context.svelte.js";
  import DropIndicator from "../../drop-indicator.svelte";
  import EnumItem from "./enum-item.svelte";

  interface Props {
    items: EnumItemNode[];
    valueType: EnumValueType;
  }

  let { items = $bindable(), valueType }: Props = $props();

  const { toValue } = $derived.by(() => {
    if (valueType === EnumValueType.JSON) {
      return {
        toValue(value: string) {
          if (JSON_CONSTANTS.has(value) || Number(value).toString() === value) {
            return value;
          }
          return JSON.stringify(value);
        },
      };
    }
    return { toValue: identity };
  });

  const TYPE_TO_STRING: Record<EnumValueType, (v: string) => string> = {
    [EnumValueType.JSON]: (value: string) => {
      try {
        const parsed = JSON.parse(value);
        return typeof parsed === "string" ? parsed : value;
      } catch {
        return value;
      }
    },
    [EnumValueType.String]: identity,
  };

  let previousValueType: EnumValueType | undefined;
  $effect(() => {
    if (previousValueType !== undefined) {
      const toString = TYPE_TO_STRING[previousValueType];
      const strings = untrack(() => items.map((i) => toString(i.value)));
      for (let i = 0; i < strings.length; i++) {
        items[i].value = toValue(strings[i]);
      }
      const nextValueStr = untrack(() => toString(nextValue));
      nextValue = toValue(nextValueStr);
    }
    previousValueType = valueType;
  });

  let nextLabel = $state("");
  let nextValue = $state("");

  let inputEl = $state.raw<HTMLElement | null>(null);

  function pushItem(e: Event) {
    e.stopPropagation();
    items.push(createEnumItemNode(nextLabel, nextValue));
    nextLabel = "";
    nextValue = toValue("");
    inputEl?.focus();
  }

  function onEnter(e: KeyboardEvent) {
    if (e.code === "Enter") {
      e.preventDefault();
      pushItem(e);
    }
  }

  const ctx = getBuilderContext();
</script>

<div class="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
  <Input
    bind:ref={inputEl}
    placeholder="Enter label..."
    bind:value={
      () => nextLabel,
      (v) => {
        if (toValue(nextLabel) === nextValue) {
          nextValue = toValue(v);
        }
        nextLabel = v;
      }
    }
    onkeydown={onEnter}
  />
  <Input
    placeholder="Enter value..."
    bind:value={nextValue}
    onkeydown={onEnter}
  />
  <Button variant="outline" size="icon" class="size-8" onclick={pushItem}>
    <Plus class="size-4" />
  </Button>
</div>
<div class="flex flex-col gap-0.5">
  {#each items as item, i (item.id)}
    {@const unmount = () => {
      items.splice(i, 1);
    }}
    {@const draggable = ctx.createDraggable({
      unmount,
      get node() {
        return items[i];
      },
    })}
    <DropIndicator
      accept={isEnumItemNode}
      onDrop={(item) => {
        items.splice(i, 0, item);
      }}
    />
    <EnumItem
      showRequired={false}
      bind:node={items[i]}
      {draggable}
      {toValue}
      {unmount}
    />
  {/each}
  <DropIndicator
    accept={isEnumItemNode}
    onDrop={(item) => {
      items.push(item);
    }}
  />
</div>
