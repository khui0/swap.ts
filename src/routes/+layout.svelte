<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-full flex-col items-center justify-center gap-2">
  {@render children()}
</div>

<style>
  :global(html, body) {
    height: 100%;
  }
</style>
