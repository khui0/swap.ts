<script lang="ts">
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  console.log(data);
</script>

<div class="flex w-full max-w-xl flex-col gap-2 p-4">
  <h1>{data.group.name}</h1>
  <p>{data.group.description}</p>
  <!-- <p>{data.group.}</p> -->
</div>
