<script lang="ts">
  import { authClient } from "$lib/auth-client";
  import TablerExclamationCircleFilled from "~icons/tabler/exclamation-circle-filled";
  import TablerCircleCheckFilled from "~icons/tabler/circle-check-filled";

  const FormState = {
    Idle: 0,
    Success: 1,
    Error: 2,
  };

  type FormState = (typeof FormState)[keyof typeof FormState];

  let { current }: { current: string } = $props();

  let formState = $state(FormState.Idle);
  let errorMessage = $state("");
  let errorCode = $state("");

  let newName = $state(current);

  async function submit() {
    const { error } = await authClient.updateUser({
      name: newName,
    });

    if (error) {
      formState = FormState.Error;
      errorMessage = error.message || "";
      errorCode = error.code || "";
    } else {
      formState = FormState.Success;
    }
  }
</script>

<input type="text" class="input w-full" placeholder="New Display Name" bind:value={newName} />
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
      Display name changed
    {/if}
  </p>
{/if}
<button class="btn" onclick={submit}>Change</button>
