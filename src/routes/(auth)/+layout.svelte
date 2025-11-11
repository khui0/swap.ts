<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children?: Snippet } = $props();
</script>

<div class="flex h-full w-full items-center justify-center">
  <form
    class="flex w-full max-w-xs flex-col items-start gap-2"
    onsubmit={(e) => {
      e.preventDefault();
    }}
  >
    <enhanced:img src="$lib/assets/icon.png" alt="swap.ts icon" class="w-16 mt-4" />
    {@render children?.()}
  </form>
</div>
