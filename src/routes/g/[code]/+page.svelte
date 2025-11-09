<script lang="ts">
  import type { PageProps } from "./$types";
  import TablerTrash from "~icons/tabler/trash";
  import TablerPencil from "~icons/tabler/pencil";
  import TablerLock from "~icons/tabler/lock";
  import Confirm from "$lib/components/modal/confirm.svelte";
  import { goto } from "$app/navigation";
  import Modal from "$lib/components/modal/modal.svelte";

  let { data }: PageProps = $props();

  let addMyMessageModal = <Modal>$state();
  let editGroupModal = <Modal>$state();
  let deleteGroupConfirm = <Confirm>$state();

  async function deleteGroup() {
    const response = await fetch(`/api/group/${data.group.code}`, {
      method: "DELETE",
    });

    if (response.ok) {
      goto("/");
    }
  }
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
    <div class="flex shrink-0 gap-2">
      <button class="btn" onclick={addMyMessageModal.show}>Add My Message</button>
      {#if data.isOwner}
        <button aria-label="Edit group" class="btn btn-circle" onclick={editGroupModal.show}
          ><TablerPencil /></button
        >
        <button aria-label="Delete group" class="btn btn-circle" onclick={deleteGroupConfirm.prompt}
          ><TablerTrash /></button
        >
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
    <div class="flex h-20 items-center justify-center container-dotted p-4">
      {#if !data.group.closed}
        <p class="text-sm font-medium text-base-content/50">
          Matches haven't been picked yet! We'll send you an email when you receive your match.
        </p>
      {:else}
        <button class="btn">View Your Match</button>
      {/if}
    </div>
    {#each data.members as member}
      <div class="flex h-20 justify-between rounded-field bg-base-200 px-4 py-3">
        <div class="flex flex-col justify-between">
          <h2 class="text-2xl text-base-content">{member.name}</h2>
          <p class="text-sm text-base-content/80">{member.message || "No message"}</p>
        </div>
        <div class="flex items-center justify-between gap-2">
          <button class="btn">Edit Restrictions</button>
        </div>
      </div>
    {/each}
  </ul>
</div>

<Modal title="Message" bind:this={addMyMessageModal}>
  <input type="text" class="input w-full" placeholder="Leave a message for everyone else to see" />
  <p class="text-end text-xs font-semibold text-base-content/50">0/150</p>
  <button class="btn">Save</button>
</Modal>

<Modal title="Edit Group" bind:this={editGroupModal}>
  <input type="text" class="input w-full" placeholder="Title" />
  <input type="text" class="input w-full" placeholder="Description" />
  <button class="btn">Save</button>
</Modal>

<Confirm
  bind:this={deleteGroupConfirm}
  title="Delete this group?"
  body="This action is irreversible. All members will be removed from the group."
  action="Delete"
  destructive
  onaccept={deleteGroup}
/>
