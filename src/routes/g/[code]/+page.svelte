<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation";
  import { authClient } from "$lib/auth-client";
  import EditGroupModal from "$lib/components/group/edit-group-modal.svelte";
  import EditMessageModal from "$lib/components/group/edit-message-modal.svelte";
  import EditRestrictionsModal from "$lib/components/group/edit-restrictions-modal.svelte";
  import Confirm from "$lib/components/modal/confirm.svelte";
  import Modal from "$lib/components/modal/modal.svelte";
  import { run } from "$lib/components/particles/confetti";
  import { APP_NAME } from "$lib/meta";
  import TablerCircleCheckFilled from "~icons/tabler/circle-check-filled";
  import TablerExclamationCircleFilled from "~icons/tabler/exclamation-circle-filled";
  import TablerHandStop from "~icons/tabler/hand-stop";
  import TablerLock from "~icons/tabler/lock";
  import TablerMessage from "~icons/tabler/message";
  import TablerPencil from "~icons/tabler/pencil";
  import TablerPlus from "~icons/tabler/plus";
  import TablerTrash from "~icons/tabler/trash";
  import TablerUserX from "~icons/tabler/user-x";
  import type { PageProps } from "./$types";

  const FormState = {
    Idle: 0,
    Success: 1,
    Error: 2,
  };

  type FormState = (typeof FormState)[keyof typeof FormState];

  let formState = $state(FormState.Idle);
  let errorMessage = $state("");

  let { data }: PageProps = $props();

  const session = authClient.useSession();

  let editMessageModal = <EditMessageModal>$state();
  let editGroupModal = <EditGroupModal>$state();
  let editRestrictionsModal = <EditRestrictionsModal>$state();
  let matchModal = <Modal>$state();
  let deleteGroupConfirm = <Confirm>$state();
  let deleteUserConfirm = <Confirm>$state();
  let leaveGroupConfirm = <Confirm>$state();
  let generateMatchesConfirm = <Confirm>$state();
  let resetMatchesConfirm = <Confirm>$state();

  async function deleteGroup() {
    if (!data.joined || !data.joined.isOwner) return;

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

  async function leaveGroup() {
    if (!data.joined) return;

    await removeUser(data.joined.self.id);
  }

  async function generateMatches() {
    if (!data.joined || !data.joined.isOwner) return;

    const response = await fetch(`/api/group/${data.joined.group.code}/match`, {
      method: "POST",
    });

    if (response.ok) {
      formState = FormState.Success;

      invalidateAll();
    } else {
      formState = FormState.Error;
      errorMessage = (await response.json()).message;
    }
  }

  async function resetMatches() {
    if (!data.joined || !data.joined.isOwner) return;

    const response = await fetch(`/api/group/${data.joined.group.code}/match`, {
      method: "DELETE",
    });

    if (response.ok) {
      invalidateAll();
    }
  }
</script>

{#if data.joined}
  <div class="flex justify-between">
    <div class="flex flex-col">
      <div class="flex items-center gap-2">
        <h1>
          {data.joined.group.name.substring(0, 100)}
          {#if data.joined.group.closed}
            <span class="inline-flex text-2xl"><TablerLock /></span>
          {/if}
        </h1>
      </div>
      <p>{data.joined.group.description.substring(0, 250)}</p>
    </div>
    <div class="flex shrink-0 gap-2">
      <button
        class="btn max-sm:btn-circle"
        onclick={() => {
          editMessageModal.show(
            data.joined.self.message || "",
            data.joined.self.hiddenMessage || false,
          );
        }}
      >
        <TablerMessage />
        <span class="max-sm:hidden">Edit Message</span>
      </button>
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
        <button class="btn" onclick={leaveGroupConfirm.prompt}>Leave Group</button>
      {/if}
    </div>
  </div>
  <ul class="flex flex-col gap-2">
    {#if data.joined.isOwner}
      <div class="flex min-h-20 flex-col items-center justify-center gap-2 container-dotted p-4">
        {#if !data.joined.group.closed}
          <button class="btn" onclick={generateMatchesConfirm.prompt}>Generate Matches</button>
        {:else}
          <button class="btn" onclick={resetMatchesConfirm.prompt}>Reset Matches</button>
        {/if}
        {#if formState !== FormState.Idle}
          <p class="text-sm font-medium text-base-content/80">
            {#if formState === FormState.Error}
              <span class="text-lg text-error">
                <TablerExclamationCircleFilled class="inline h-[1.2em] w-[1.2em] align-middle" />
              </span>
              {errorMessage}
            {:else if formState === FormState.Success}
              <span class="text-lg text-success">
                <TablerCircleCheckFilled class="inline h-[1.2em] w-[1.2em] align-middle" />
              </span>
              Generated matches. Emails have been sent to all members.
            {/if}
          </p>
        {/if}
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
        <button class="btn" onclick={matchModal.show}>View Your Recipient</button>
      {/if}
    </div>
    {#each data.joined.members as member}
      <div class="grid h-20 grid-cols-[1fr_auto] gap-2 rounded-field bg-base-200 px-4 py-3">
        <div class="flex flex-col justify-between overflow-hidden">
          <h2 class="overflow-hidden text-2xl text-ellipsis whitespace-nowrap text-base-content">
            {member.name}
          </h2>
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
              class="btn max-sm:btn-circle"
              onclick={() => {
                editRestrictionsModal.show(member);
              }}
            >
              <TablerHandStop />
              <span class="max-sm:hidden">Edit Restrictions</span>
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

  <Modal
    bind:this={matchModal}
    title={data.joined.match === null ? "Unable to find your recipient" : ""}
    onshow={() => {
      run();
    }}
  >
    {#if data.joined.match !== null}
      <div class="flex flex-col items-center gap-2 text-center">
        <h2>Your Recipient</h2>
        <p class="my-2 text-4xl font-bold">{data.joined.match.name}</p>
        <p>
          <span class="italic">
            {data.joined.match.message ? `"${data.joined.match.message}"` : "No message"}
          </span>
        </p>
        {#if data.joined.match.hiddenMessage}
          <p class="text-sm text-base-content/80">
            The message above is hidden and can only be seen by you
          </p>
        {/if}
        <p class="text-sm text-base-content/80">
          Remember to review the group description for details
        </p>
        <p>{data.joined.group.description}</p>
      </div>
    {:else}
      <p class="text-sm text-base-content/80">
        An unforeseen error has been encountered. This may happen if your recipient leaves the group
        after matches have been generated. Ask the group owner to generate new matches.
      </p>
    {/if}
  </Modal>
{:else}
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

<Confirm
  bind:this={leaveGroupConfirm}
  title="Leave this group?"
  body="You may not be able to rejoin the group if the owner generates matches."
  action="Leave"
  destructive
  onaccept={leaveGroup}
></Confirm>

<Confirm
  bind:this={generateMatchesConfirm}
  title="Generate matches?"
  body="This will generate random matches and notify all members via email. Make sure your restrictions are properly set before doing so."
  action="Generate"
  onaccept={generateMatches}
></Confirm>

<Confirm
  bind:this={resetMatchesConfirm}
  title="Reset matches?"
  body="This will reopen the group, allowing anyone to join. Members will no longer be able to see their existing recipient."
  action="Reset"
  destructive
  onaccept={resetMatches}
></Confirm>
