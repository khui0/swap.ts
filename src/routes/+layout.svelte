<script lang="ts">
  import "../app.css";
  import "@fontsource-variable/figtree";

  let { children } = $props();
</script>

<svelte:head>
  <title>swap.ts</title>
</svelte:head>

<div class="flex h-full flex-col">
  {@render children()}
</div>

<style>
  :global(html, body) {
    height: 100%;
  }
</style>
