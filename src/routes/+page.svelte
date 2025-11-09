<script lang="ts">
  import { authClient } from "$lib/auth-client";
  import ChangeEmail from "$lib/components/auth/change-email.svelte";
  import ChangePassword from "$lib/components/auth/change-password.svelte";
  import CreateGroupModal from "$lib/components/group/create-group-modal.svelte";
  import JoinGroupModal from "$lib/components/group/join-group-modal.svelte";
  import Confirm from "$lib/components/modal/confirm.svelte";
  import Modal from "$lib/components/modal/modal.svelte";
  import { APP_NAME } from "$lib/meta";
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  import TablerLock from "~icons/tabler/lock";
  import TablerLogout from "~icons/tabler/logout";
  import TablerPencil from "~icons/tabler/pencil";
  import TablerPlus from "~icons/tabler/plus";
  import type { PageProps } from "./$types";
  dayjs.extend(relativeTime);

  let { data }: PageProps = $props();

  const session = authClient.useSession();

  let accountModal = <Modal>$state();
  let deleteAccountConfirm = <Confirm>$state();

  let createGroupModal = <CreateGroupModal>$state();
  let joinGroupModal = <JoinGroupModal>$state();
</script>

<div class="flex w-full max-w-xl flex-col gap-2 p-4">
  <div class="flex flex-wrap items-center justify-between gap-2">
    <h1 class="mb-1 text-4xl">{APP_NAME}</h1>
    <div class="flex items-center gap-2">
      {#if $session.data !== null}
        <button
          class="btn"
          onclick={() => {
            accountModal?.show();
          }}
        >
          {$session.data.user.name}
        </button>
        <button
          aria-label="Sign out"
          class="btn btn-circle"
          onclick={async () => {
            await authClient.signOut();
          }}
        >
          <span class="translate-x-0.5"><TablerLogout /></span>
        </button>
      {/if}
    </div>
  </div>
  {#if $session.data === null}
    <a class="btn btn-primary" href="/sign-up">Get Started</a>
    <a class="btn btn-ghost" href="/sign-in">Sign into existing account</a>
  {:else}
    <ul class="flex flex-col gap-2">
      {#if data.groups?.length || 0 > 0}
        {#each data.groups as group}
          <a
            class="flex h-20 flex-col justify-between rounded-field bg-base-200 px-4 py-3"
            href="/g/{group.code}"
          >
            <div class="flex items-start justify-between">
              <div class="grid grid-cols-[1fr_auto] gap-2">
                <h2
                  class="overflow-hidden text-2xl text-ellipsis whitespace-nowrap text-base-content"
                >
                  {group.name}
                </h2>
                {#if group.closed}
                  <span class="text-xl"><TablerLock /></span>
                {/if}
              </div>
              <p class="container-badge shrink-0">
                Updated {dayjs(group.updatedAt).from(dayjs())}
              </p>
            </div>
            <div class="grid grid-cols-[1fr_auto] text-base-content/80 gap-2">
              <p class="overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                {group.description}
              </p>
              <p class="overflow-hidden text-sm text-ellipsis whitespace-nowrap">{group.owner}</p>
            </div>
          </a>
        {/each}
      {:else}
        <div class="flex h-20 items-center justify-center container-dotted p-4">
          <p class="text-sm font-medium text-base-content/50">You aren't in any groups</p>
        </div>
      {/if}
    </ul>
    <div class="grid grid-cols-2 gap-2">
      <button class="btn" onclick={joinGroupModal.show}>
        <TablerPlus />
        Join Group
      </button>
      <button class="btn" onclick={createGroupModal.show}>
        <TablerPencil />
        Create Group
      </button>
    </div>
  {/if}
</div>

<Modal title={$session.data?.user.name || "Account"} bind:this={accountModal}>
  <div class="flex flex-col gap-2 container-dotted p-4">
    <h2 class="leading-none">Change Email</h2>
    <ChangeEmail />
  </div>
  <div class="flex flex-col gap-2 container-dotted p-4">
    <h2 class="leading-none">Change Password</h2>
    <ChangePassword />
  </div>
  <div class="flex flex-col gap-2 container-dotted border-error p-4">
    <h2 class="leading-none text-error-content">Danger Zone</h2>
    <button class="btn btn-error" onclick={deleteAccountConfirm.prompt}> Delete Account </button>
  </div>
  <button
    aria-label="Sign out"
    class="btn"
    onclick={async () => {
      await authClient.signOut();
    }}
  >
    <TablerLogout />Sign Out
  </button>
</Modal>

<CreateGroupModal bind:this={createGroupModal} />

<JoinGroupModal bind:this={joinGroupModal} />

<Confirm
  bind:this={deleteAccountConfirm}
  title="Delete Account?"
  body="This action is irreversible. Deleting your account will remove you from any groups you are a part of and will delete any groups you have created. If you choose to do so, you will receive a confirmation email."
  action="Send Confirmation"
  destructive
  onaccept={async () => {
    await authClient.deleteUser({
      callbackURL: "/goodbye",
    });
  }}
/>
