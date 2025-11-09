<script lang="ts">
  import Modal from "$lib/components/modal/modal.svelte";
  import TablerExclamationCircleFilled from "~icons/tabler/exclamation-circle-filled";
  import TablerCircleCheckFilled from "~icons/tabler/circle-check-filled";
  import { invalidateAll } from "$app/navigation";
  import { page } from "$app/state";

  let { code }: { code: string } = $props();

  const FormState = {
    Idle: 0,
    Success: 1,
    Error: 2,
  };

  type FormState = (typeof FormState)[keyof typeof FormState];

  let formState = $state(FormState.Idle);
  let errorMessage = $state("");

  let modal = <Modal>$state();

  let newName = $state("");
  let newDescription = $state("");

  export function show(name: string, description: string) {
    formState = FormState.Idle;
    newName = name;
    newDescription = description;
    modal.show();
  }

  async function submit(e: Event) {
    e.preventDefault();

    if (newName.length > 100) {
      formState = FormState.Error;
      errorMessage = "Group name is too long";
      return;
    }

    if (newDescription.length > 250) {
      formState = FormState.Error;
      errorMessage = "Group description is too long";
      return;
    }

    const response = await fetch(`/api/group/${code}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: newName,
        description: newDescription,
      }),
    });

    if (response.ok) {
      formState = FormState.Success;

      modal.close();
      invalidateAll();
    } else {
      formState = FormState.Error;
      errorMessage = (await response.json()).message;
    }
  }
</script>

<Modal title="Edit Group" bind:this={modal}>
  <input type="text" class="input w-full" placeholder="Name" bind:value={newName} />
  <p
    class={{
      "text-end text-xs font-semibold text-base-content/50": true,
      "text-error": newName.length > 100,
    }}
  >
    {newName.length}/100
  </p>
  <input type="text" class="input w-full" placeholder="Description" bind:value={newDescription} />
  <p
    class={{
      "text-end text-xs font-semibold text-base-content/50": true,
      "text-error": newDescription.length > 250,
    }}
  >
    {newDescription.length}/250
  </p>
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
        Updated group information
      {/if}
    </p>
  {/if}
  <button class="btn" onclick={submit}>Save</button>
</Modal>
