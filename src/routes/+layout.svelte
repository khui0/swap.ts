<script lang="ts">
  import { APP_NAME } from "$lib/meta";
  import "@fontsource-variable/figtree";
  import "../app.css";

  let { children } = $props();
</script>

<svelte:head>
  <title>{APP_NAME}</title>
</svelte:head>

<div class="flex min-h-full flex-col items-center justify-center">
  {@render children()}
</div>
