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
    <a href="/" aria-label="swap.ts home"
      ><enhanced:img src="$lib/assets/icon.png" alt="swap.ts icon" class="mt-4 w-16" /></a
    >
    {@render children?.()}
  </form>
</div>
