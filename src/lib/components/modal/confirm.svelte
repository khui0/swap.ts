<script lang="ts">
  import Modal from "./modal.svelte";

  let modal: Modal;

  let {
    title,
    body,
    action,
    destructive,
    onaccept,
    onreject,
  }: {
    title: string;
    body: string;
    action: string;
    destructive?: boolean;
    onaccept?: () => void;
    onreject?: () => void;
  } = $props();

  export function prompt() {
    modal.show();
  }
</script>

<Modal {title} bind:this={modal} onclose={onreject}>
  <p class="text-sm text-base-content/80">{body}</p>
  <form method="dialog" class="my-1 flex gap-2">
    <button class="btn flex-1">Cancel</button>
    <button
      class={{
        "btn flex-1": true,
        "btn-error": destructive,
      }}
      onclick={onaccept}
    >
      {action}
    </button>
  </form>
</Modal>
