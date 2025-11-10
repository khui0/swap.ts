<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import Modal from "$lib/components/modal/modal.svelte";
  import TablerCircleCheckFilled from "~icons/tabler/circle-check-filled";
  import TablerExclamationCircleFilled from "~icons/tabler/exclamation-circle-filled";

  interface User {
    id: string;
    name: string;
  }

  let { code, members }: { code: string; members: User[] } = $props();

  const FormState = {
    Idle: 0,
    Success: 1,
    Error: 2,
  };

  type FormState = (typeof FormState)[keyof typeof FormState];

  let formState = $state(FormState.Idle);
  let errorMessage = $state("");

  let modal = <Modal>$state();

  let currentUser: User | null = $state(null);

  export function show(user: User) {
    formState = FormState.Idle;
    currentUser = user;
    modal.show();
  }

  async function submit(e: Event) {
    e.preventDefault();

    // if (messageValue.length > 250) {
    //   formState = FormState.Error;
    //   errorMessage = "Message is too long";
    //   return;
    // }

    // const response = await fetch(`/api/group/${code}/message`, {
    //   method: "PATCH",
    //   body: JSON.stringify({
    //     message: messageValue,
    //     hidden: hiddenValue,
    //   }),
    // });

    // if (response.ok) {
    //   formState = FormState.Success;

    //   modal.close();
    //   invalidateAll();
    // } else {
    //   formState = FormState.Error;
    //   errorMessage = (await response.json()).message;
    // }
  }
</script>

<Modal title="Edit Restrictions" bind:this={modal}>
  <p class="text-sm">
    Select which recipients <b>{currentUser?.name}</b> is not allowed to be matched with.
  </p>
  <ul class="flex flex-col gap-2">
    {#each members.filter((user) => user.id !== currentUser?.id) as member}
      <li class="grid grid-cols-[1fr_auto] gap-2">
        <p>{member.name}</p>
        <input type="checkbox" checked class="toggle" />
      </li>
    {/each}
  </ul>
  {#if formState !== FormState.Idle}
    <p class="self-stretch text-sm font-medium text-base-content/80">
      {#if formState === FormState.Error}
        <span class="text-lg text-error">
          <TablerExclamationCircleFilled class="inline h-[1.2em] w-[1.2em] align-middle" />
        </span>
        {errorMessage}
      {:else if formState === FormState.Success}
        <span class="text-lg text-success">
          <TablerCircleCheckFilled class="inline h-[1.2em] w-[1.2em] align-middle" />
        </span>
        Saved restrictions
      {/if}
    </p>
  {/if}
  <button class="btn" onclick={submit}>Save</button>
</Modal>
