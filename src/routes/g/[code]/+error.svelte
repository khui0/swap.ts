<script lang="ts">
  import { page } from "$app/state";
  import { APP_NAME } from "$lib/meta";
</script>

<div class="flex w-full max-w-xl flex-col gap-2 p-4">
  <h1>Unable to find group</h1>
  <h2>{page.status}: {page.error?.message}</h2>
  <div class="flex gap-2">
    <a href="/" class="btn">{APP_NAME}</a>
  </div>
</div>
