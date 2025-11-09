<script lang="ts">
  import "../app.css";
  import "@fontsource-variable/figtree";

  let { children } = $props();
</script>

<svelte:head>
  <title>swap.ts</title>
</svelte:head>

<div class="flex min-h-full flex-col items-center justify-center">
  {@render children()}
</div>
