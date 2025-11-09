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

  let messageValue = $state("");
  let hiddenValue = $state(false);

  export function show(message: string, hidden: boolean) {
    formState = FormState.Idle;
    messageValue = message;
    hiddenValue = hidden;
    modal.show();
  }

  async function submit(e: Event) {
    e.preventDefault();

    if (messageValue.length > 250) {
      formState = FormState.Error;
      errorMessage = "Message is too long";
      return;
    }

    const response = await fetch(`/api/group/${code}/message`, {
      method: "PATCH",
      body: JSON.stringify({
        message: messageValue,
        hidden: hiddenValue,
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

<Modal title="Edit Message" bind:this={modal}>
  <input type="text" class="input w-full" placeholder="Message" bind:value={messageValue} />
  <p
    class={{
      "text-end text-xs font-semibold text-base-content/50": true,
      "text-error": messageValue.length > 250,
    }}
  >
    {messageValue.length}/250
  </p>
  <label class="label text-sm">
    <input type="checkbox" bind:checked={hiddenValue} class="toggle toggle-sm" />
    Hidden (only your gifter can see your message)
  </label>
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
        Updated my message
      {/if}
    </p>
  {/if}
  <button class="btn" onclick={submit}>Save</button>
</Modal>
