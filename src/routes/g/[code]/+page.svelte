<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation";
  import { authClient } from "$lib/auth-client";
  import EditGroupModal from "$lib/components/group/edit-group-modal.svelte";
  import EditMessageModal from "$lib/components/group/edit-message-modal.svelte";
  import EditRestrictionsModal from "$lib/components/group/edit-restrictions-modal.svelte";
  import Confirm from "$lib/components/modal/confirm.svelte";
  import { APP_NAME } from "$lib/meta";
  import TablerLock from "~icons/tabler/lock";
  import TablerPencil from "~icons/tabler/pencil";
  import TablerPlus from "~icons/tabler/plus";
  import TablerTrash from "~icons/tabler/trash";
  import TablerUserX from "~icons/tabler/user-x";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  const session = authClient.useSession();

  let editMessageModal = <EditMessageModal>$state();
  let editGroupModal = <EditGroupModal>$state();
  let editRestrictionsModal = <EditRestrictionsModal>$state();
  let deleteGroupConfirm = <Confirm>$state();
  let deleteUserConfirm = <Confirm>$state();

  async function deleteGroup() {
    if (!data.joined) return;

    const response = await fetch(`/api/group/${data.joined.group.code}`, {
      method: "DELETE",
    });

    if (response.ok) {
      goto("/");
    }
  }

  let currentUserIdToRemove: { id: string; name: string } | null = $state(null);

  async function removeUser(userId: string) {
    if (!data.joined) return;

    const response = await fetch(`/api/group/${data.joined.group.code}/user`, {
      method: "DELETE",
      body: JSON.stringify({
        userId,
      }),
    });

    if (response.ok) {
      invalidateAll();
    }
  }

  async function generateMatches() {
    if (!data.joined || !data.joined.isOwner) return;

    const response = await fetch(`/api/group/${data.joined.group.code}/generate`, {
      method: "POST",
    });

    if (response.ok) {
      invalidateAll();
    }
  }
</script>

{#if data.joined}
  <div class="flex w-full max-w-xl flex-col gap-2 p-4">
    <div class="flex justify-between">
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <h1>
            {data.joined.group.name.substring(0, 100)}
            {#if data.joined.group.closed}
              <span class="inline-flex text-xl"><TablerLock /></span>
            {/if}
          </h1>
        </div>
        <p>{data.joined.group.description.substring(0, 250)}</p>
      </div>
      <div class="flex shrink-0 gap-2">
        <button
          class="btn"
          onclick={() => {
            editMessageModal.show(
              data.joined.self.message || "",
              data.joined.self.hiddenMessage || false,
            );
          }}>Edit Message</button
        >
        {#if data.joined.isOwner}
          <button
            aria-label="Edit group"
            class="btn btn-circle"
            onclick={() => {
              editGroupModal.show(data.joined.group.name, data.joined.group.description);
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
          <button
            class="btn"
            onclick={async () => {
              const response = await fetch(`/api/group/${data.joined.group.code}/user`, {
                method: "DELETE",
                body: JSON.stringify({
                  userId: data.joined.self.id,
                }),
              });

              if (response.ok) {
                invalidateAll();
              }
            }}
          >
            Leave Group
          </button>
        {/if}
      </div>
    </div>
    <ul class="flex flex-col gap-2">
      {#if data.joined.isOwner}
        <div class="flex h-20 items-center justify-center container-dotted p-4">
          <button class="btn" onclick={generateMatches}>Generate Matches</button>
        </div>
      {/if}
      <div class="flex min-h-20 items-center justify-center container-dotted px-4 py-3">
        {#if !data.joined.group.closed}
          <p class="text-sm font-medium text-base-content/50">
            {#if !data.joined.isOwner}
              Matches haven't been picked yet! We'll send you an email when you receive your match.
            {:else}
              Matches haven't been picked yet! This group is currently joinable. Once you generate
              matches, this group will become closed.
            {/if}
          </p>
        {:else}
          <button class="btn">View Your Match</button>
        {/if}
      </div>
      {#each data.joined.members as member}
        <div class="grid h-20 grid-cols-[1fr_auto] gap-2 rounded-field bg-base-200 px-4 py-3">
          <div class="flex flex-col justify-between overflow-hidden">
            <h2 class="text-2xl text-base-content">{member.name}</h2>
            <p class="overflow-hidden text-sm text-ellipsis whitespace-nowrap text-base-content/80">
              {#if member.id === $session.data?.user.id}
                {data.joined.self.message || "No message"}{data.joined.self.hiddenMessage
                  ? " (Hidden)"
                  : ""}
              {:else}
                {member.hiddenMessage ? "(Hidden)" : member.message || "No message"}
              {/if}
            </p>
          </div>
          <div class="flex items-center justify-between gap-2">
            {#if data.joined.isOwner}
              <button
                class="btn"
                onclick={() => {
                  editRestrictionsModal.show(member);
                }}
              >
                Edit Restrictions
              </button>
              <button
                class="btn btn-circle btn-ghost"
                disabled={data.joined.self.id === member.id}
                onclick={() => {
                  currentUserIdToRemove = member;
                  deleteUserConfirm.prompt();
                }}
              >
                <TablerUserX />
              </button>
            {/if}
          </div>
        </div>
      {/each}
    </ul>
    <a href="/" class="btn mt-2 self-center">{APP_NAME}</a>
  </div>

  <EditMessageModal code={data.joined.group.code} bind:this={editMessageModal} />

  <EditGroupModal code={data.joined.group.code} bind:this={editGroupModal} />

  {#if data.joined.restrictions}
    <EditRestrictionsModal
      code={data.joined.group.code}
      members={data.joined.members}
      restrictions={data.joined.restrictions}
      bind:this={editRestrictionsModal}
    />
  {/if}
{:else}
  <div class="flex w-full max-w-xl flex-col gap-2 p-4">
    <h1>Join {data.name}</h1>
    {#if $session.data === null}
      <div class="flex gap-2">
        <a class="btn btn-primary" href="/sign-up?code={data.code}">Get Started</a>
        <a class="btn btn-ghost" href="/sign-in?code={data.code}">Sign into existing account</a>
      </div>
    {:else}
      <div class="flex gap-2">
        {#if !data.closed}
          <button
            class="btn btn-primary"
            onclick={async () => {
              const response = await fetch(`/api/group/${data.code}/user`, {
                method: "POST",
              });

              if (response.ok) {
                invalidateAll();
              }
            }}
            ><TablerPlus />
            Join Group
          </button>
        {:else}
          <button class="btn btn-primary" disabled><TablerLock />Group Closed</button>
        {/if}
        <a href="/" class="btn">{APP_NAME}</a>
      </div>
    {/if}
  </div>
{/if}

<Confirm
  bind:this={deleteGroupConfirm}
  title="Delete this group?"
  body="This action is irreversible. All members will be removed from the group."
  action="Delete"
  destructive
  onaccept={deleteGroup}
/>

<Confirm
  bind:this={deleteUserConfirm}
  title="Remove {currentUserIdToRemove?.name}?"
  body="Doing so will not notify them."
  action="Remove"
  destructive
  onaccept={() => {
    if (currentUserIdToRemove === null) return;
    removeUser(currentUserIdToRemove.id);
    currentUserIdToRemove = null;
  }}
/>
