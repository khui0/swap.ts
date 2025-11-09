<script lang="ts">
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  console.log(data.group);
</script>

<div class="flex w-full max-w-xl flex-col gap-2 p-4">
  <h1>{data.group?.[0].name}</h1>
</div>
