<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children?: Snippet } = $props();
</script>

<div class="flex h-full w-full items-center justify-center">
  <form
    class="flex w-full max-w-xs flex-col items-start gap-2 p-4"
    onsubmit={(e) => {
      e.preventDefault();
    }}
  >
    {@render children?.()}
  </form>
</div>
