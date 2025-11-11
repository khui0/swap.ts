<script lang="ts">
  import type { Snippet } from "svelte";
  import TablerX from "~icons/tabler/x";

  let {
    title,
    onshow,
    onclose,
    children,
  }: {
    title?: string;
    onshow?: () => void;
    onclose?: () => void;
    children: Snippet;
  } = $props();

  let modal: HTMLDialogElement;

  export const show = () => {
    onshow?.();
    modal.showModal();
  };

  export const close = () => {
    onclose?.();
    modal.close();
  };
</script>

<dialog class="modal open:bg-white/50" bind:this={modal} {onclose}>
  <div class="modal-box p-4">
    <form method="dialog">
      <button class="btn absolute top-3 right-3 btn-square text-xl btn-ghost" aria-label="Close">
        <TablerX />
      </button>
    </form>
    <div class="mx-1 flex flex-col gap-2">
      <h1 class="mr-12">{title}</h1>
      {@render children()}
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
