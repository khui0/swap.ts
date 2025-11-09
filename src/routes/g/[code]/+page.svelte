<script lang="ts">
  import type { PageProps } from "./$types";
  import TablerTrash from "~icons/tabler/trash";
  import TablerPencil from "~icons/tabler/pencil";
  import TablerLock from "~icons/tabler/lock";

  let { data }: PageProps = $props();
  console.log(data);
</script>

<div class="flex w-full max-w-xl flex-col gap-2 p-4">
  <div class="flex justify-between">
    <div class="flex flex-col">
      <div class="flex items-center gap-2">
        <h1>{data.group.name}</h1>
        {#if data.group.closed}
          <span class="text-xl"><TablerLock /></span>
        {/if}
      </div>
      <p>{data.group.description}</p>
    </div>
    <div class="flex gap-2">
      <button class="btn">Add My Message</button>
      {#if data.isOwner}
        <button aria-label="Edit group" class="btn btn-circle"><TablerPencil /></button>
        <button aria-label="Delete group" class="btn btn-circle"><TablerTrash /></button>
      {:else}
        <button class="btn">Leave Group</button>
      {/if}
    </div>
  </div>
  <ul class="flex flex-col gap-2">
    {#if data.isOwner}
      <div class="flex h-20 items-center justify-center container-dotted p-4">
        <button class="btn">Generate Matches</button>
      </div>
    {/if}
    {#if !data.group.closed}
      <div class="flex h-20 items-center justify-center container-dotted p-4">
        <p class="text-sm font-medium text-base-content/50">
          Matches haven't been picked yet! We'll send you an email when you receive your match.
        </p>
      </div>
    {/if}
    {#each data.members as member}
      <div class="flex h-20 justify-between rounded-field bg-base-200 px-4 py-3">
        <div class="flex flex-col justify-between">
          <h2 class="text-2xl text-base-content">{member.name}</h2>
          <p class="text-sm text-base-content/80">{member.message || "No message"}</p>
        </div>
        <div class="flex gap-2 justify-between">
          
        </div>
      </div>
    {/each}
  </ul>
</div>
