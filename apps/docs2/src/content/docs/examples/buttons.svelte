<script lang="ts" generics="T">
  interface Props {
    items: T[];
    onClick: (item: T) => void;
    label: (item: T) => string;
  }

  const { items, onClick, label }: Props = $props();
</script>

<div class="buttons">
  <button style="display: none;">Avoid starlight styles pollution</button>
  {#each items as item (item)}
    <button class="button" onclick={() => onClick(item)}>
      {label(item)}
    </button>
  {/each}
</div>

<style>
  .buttons {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    column-gap: 0.5rem;
  }
  .button {
    min-width: fit-content;
    appearance: none;
    cursor: pointer;
    text-align: center;
    user-select: none;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    display: inline-flex;
    padding-inline: 1.25rem;
    padding-block: 0.15rem;
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 2rem;
    background-color: var(--sl-color-bg);
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    /* box-shadow: var(--sl-shadow-md); */
    &:hover, &:focus {
      background-color: var(--sl-color-gray-5);
      border-color: var(--sl-color-text-accent);
    }
  }
</style>
