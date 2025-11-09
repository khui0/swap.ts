<script lang="ts">
  import { authClient } from "$lib/auth-client";
  import type { PageProps } from "./$types";
  import TablerPencil from "~icons/tabler/pencil";
  import TablerLogout from "~icons/tabler/logout";
  import TablerPlus from "~icons/tabler/plus";
  import Modal from "$lib/components/modal/modal.svelte";
  import { page } from "$app/state";
  import Confirm from "$lib/components/modal/confirm.svelte";
  import ChangePassword from "$lib/components/auth/change-password.svelte";

  let { data }: PageProps = $props();

  const session = authClient.useSession();

  let accountModal = <Modal>$state();
  let joinGroupModal = <Modal>$state();
  let createGroupModal = <Modal>$state();
  let deleteAccountConfirm = <Confirm>$state();
</script>

<div class="m-4 flex w-full max-w-xl flex-col gap-2">
  <div class="flex flex-wrap items-center justify-between gap-2">
    <h1 class="mb-1 text-4xl">swap.ts</h1>
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
      <div class="flex h-20 items-center justify-center container-dotted">
        <p class="text-sm font-medium text-base-content/50">You aren't in any groups</p>
      </div>
    </ul>
    <div class="grid grid-cols-2 gap-2">
      <button
        class="btn"
        onclick={() => {
          joinGroupModal?.show();
        }}
        ><TablerPlus />
        Join Group
      </button>
      <button
        class="btn"
        onclick={() => {
          createGroupModal?.show();
        }}
        ><TablerPencil />
        Create Group
      </button>
    </div>
  {/if}
</div>

<Modal title={$session.data?.user.name || "Account"} bind:this={accountModal}>
  <div class="flex flex-col gap-2 container-dotted p-4">
    <h2 class="leading-none">Change Password</h2>
    <ChangePassword />
  </div>
  <div class="flex flex-col gap-2 container-dotted border-error p-4">
    <h2 class="leading-none text-error-content">Danger Zone</h2>
    <button
      class="btn btn-error"
      onclick={() => {
        deleteAccountConfirm.prompt();
      }}>Delete Account</button
    >
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

<Modal title="Join Group" bind:this={joinGroupModal}>
  <input type="text" class="input w-full" placeholder="{page.url.origin}/ABC123 or ABC123" />
  <form method="dialog" class="my-1 flex gap-2">
    <button class="btn flex-1">Cancel</button>
    <button class="btn flex-1 btn-primary" onclick={() => {}}> Join </button>
  </form>
</Modal>

<Modal title="Create Group" bind:this={createGroupModal}>
  <input type="text" class="input w-full" placeholder="Group Name" />
  <form method="dialog" class="my-1 flex gap-2">
    <button class="btn flex-1">Cancel</button>
    <button class="btn flex-1 btn-primary" onclick={() => {}}> Create </button>
  </form>
</Modal>

<Confirm
  bind:this={deleteAccountConfirm}
  title="Delete Account?"
  body="This action is irreversible. Deleting your account will remove you from any groups you are a part of and will delete any groups you have created."
  action="Delete"
  destructive
  onaccept={() => {
    // Delete Account
  }}
/>
