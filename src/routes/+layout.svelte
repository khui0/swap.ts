<script lang="ts">
  import { APP_NAME } from "$lib/meta";
  import "@fontsource-variable/figtree";
  import "../app.css";
  import Snow from "$lib/components/particles/snow.svelte";

  let { children } = $props();
</script>

<svelte:head>
  <title>{APP_NAME}</title>
  <meta name="description" content="General purpose gift exchange matcher ❄️" />

  <meta property="og:title" content={APP_NAME} />
  <meta property="og:description" content="General purpose gift exchange matcher ❄️" />
  <meta property="og:site_name" content={APP_NAME} />
</svelte:head>

<div class="snow flex min-h-full flex-col items-center justify-center bg-sky-100 p-2">
  <div class="flex w-full max-w-xl flex-col gap-2 rounded-box bg-base-100 p-4">
    {@render children()}
  </div>
</div>
<Snow />

<style>
  .snow {
    background-image: url("$lib/assets/snow-cap.png");
    background-size: 200px;
    background-repeat: repeat-x;
  }
</style>
