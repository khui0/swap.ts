<script lang="ts">
  import { authClient } from "$lib/auth-client";
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
  let errorCode = $state("");

  let currentPassword = $state("");
  let newPassword = $state("");
  let confirmPassword = $state("");

  async function changePassword() {
    if (confirmPassword !== newPassword) {
      formState = FormState.Error;
      errorMessage = "Passwords don't match";
      errorCode = "";
      return;
    }

    const { data, error } = await authClient.changePassword({
      newPassword,
      currentPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      formState = FormState.Error;
      errorMessage = error.message || "";
      errorCode = error.code || "";
    } else {
      formState = FormState.Success;
      currentPassword = "";
      newPassword = "";
      confirmPassword = "";
    }
  }
</script>

<input
  type="password"
  name="password"
  autocomplete="current-password"
  class="input w-full"
  placeholder="Current Password"
  bind:value={currentPassword}
/>
<input
  type="password"
  name="new-password"
  autocomplete="new-password"
  class="input w-full"
  placeholder="New Password"
  bind:value={newPassword}
/>
<input
  type="password"
  name="confirm-password"
  autocomplete="new-password"
  class="input w-full"
  placeholder="Confirm Password"
  bind:value={confirmPassword}
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
      Password has been changed
    {/if}
  </p>
{/if}
<button class="btn" onclick={changePassword}>Change</button>
