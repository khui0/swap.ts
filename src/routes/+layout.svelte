<script lang="ts">
  import "../app.css";

  let { children } = $props();
</script>

<svelte:head>
  <title>Checklist</title>
</svelte:head>

<div class="flex h-full flex-col">
  {@render children()}
</div>

<style>
  :global(html, body) {
    height: 100%;
  }
</style>
