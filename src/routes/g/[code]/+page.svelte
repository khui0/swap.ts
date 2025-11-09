<script lang="ts">
  import { goto } from "$app/navigation";
  import EditGroupModal from "$lib/components/group/edit-group-modal.svelte";
  import EditMessageModal from "$lib/components/group/edit-message-modal.svelte";
  import Confirm from "$lib/components/modal/confirm.svelte";
  import TablerLock from "~icons/tabler/lock";
  import TablerPencil from "~icons/tabler/pencil";
  import TablerTrash from "~icons/tabler/trash";
  import type { PageProps } from "./$types";
  import { authClient } from "$lib/auth-client";

  let { data }: PageProps = $props();

  const session = authClient.useSession();

  let editMessageModal = <EditMessageModal>$state();
  let editGroupModal = <EditGroupModal>$state();
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
        <h1>{data.group.name.substring(0, 100)}</h1>
        {#if data.group.closed}
          <span class="text-xl"><TablerLock /></span>
        {/if}
      </div>
      <p>{data.group.description.substring(0, 250)}</p>
    </div>
    <div class="flex shrink-0 gap-2">
      <button
        class="btn"
        onclick={() => {
          editMessageModal.show(data.self.message || "", data.self.hiddenMessage || false);
        }}>Edit Message</button
      >
      {#if data.isOwner}
        <button
          aria-label="Edit group"
          class="btn btn-circle"
          onclick={() => {
            editGroupModal.show(data.group.name, data.group.description);
          }}
        >
          <TablerPencil />
        </button>
        <button
          aria-label="Delete group"
          class="btn btn-circle"
          onclick={deleteGroupConfirm.prompt}
        >
          <TablerTrash />
        </button>
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
      <div class="grid h-20 grid-cols-[1fr_auto] gap-2 rounded-field bg-base-200 px-4 py-3">
        <div class="flex flex-col justify-between overflow-hidden">
          <h2 class="text-2xl text-base-content">{member.name}</h2>
          <p class="overflow-hidden text-sm text-ellipsis whitespace-nowrap text-base-content/80">
            {#if member.id === $session.data?.user.id}
              {data.self.message || "No message"}{data.self.hiddenMessage ? " (Hidden)" : ""}
            {:else}
              {member.hiddenMessage ? "(Hidden)" : member.message || "No message"}
            {/if}
          </p>
        </div>
        <div class="flex items-center justify-between gap-2">
          <button class="btn">Edit Restrictions</button>
        </div>
      </div>
    {/each}
  </ul>
</div>

<EditMessageModal code={data.group.code} bind:this={editMessageModal} />

<EditGroupModal code={data.group.code} bind:this={editGroupModal} />

<Confirm
  bind:this={deleteGroupConfirm}
  title="Delete this group?"
  body="This action is irreversible. All members will be removed from the group."
  action="Delete"
  destructive
  onaccept={deleteGroup}
/>
