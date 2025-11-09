<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { page } from "$app/state";
  import Modal from "$lib/components/modal/modal.svelte";
  import TablerCircleCheckFilled from "~icons/tabler/circle-check-filled";
  import TablerExclamationCircleFilled from "~icons/tabler/exclamation-circle-filled";

  const FormState = {
    Idle: 0,
    Success: 1,
    Error: 2,
  };

  type FormState = (typeof FormState)[keyof typeof FormState];

  let formState = $state(FormState.Idle);
  let errorMessage = $state("");

  let modal = <Modal>$state();

  export function show() {
    formState = FormState.Idle;
    modal.show();
  }

  let groupLink = $state("");

  async function joinGroup(e: Event) {
    e.preventDefault();

    const pattern = /.*\/g\/([A-Za-z0-9]{7})/;

    const code = groupLink.match(pattern)?.[1] || groupLink;

    const response = await fetch(`/api/group/${code}/join`, {
      method: "POST",
    });

    if (response.ok) {
      formState = FormState.Success;

      modal.close();
      groupLink = "";
      invalidateAll();
    } else {
      formState = FormState.Error;
      errorMessage = (await response.json()).message;
    }
  }
</script>

<Modal title="Join Group" bind:this={modal}>
  <input
    type="text"
    class="input w-full"
    placeholder="{page.url.origin}/g/ABC123 or ABC123"
    bind:value={groupLink}
  />
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
        Joined group
      {/if}
    </p>
  {/if}
  <form method="dialog" class="my-1 flex gap-2">
    <button class="btn flex-1">Cancel</button>
    <button class="btn flex-1 btn-primary" onclick={joinGroup}>Join</button>
  </form>
</Modal>
