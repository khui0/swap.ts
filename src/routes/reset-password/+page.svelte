<script lang="ts">
  import { authClient } from "$lib/auth-client";
  import TablerKey from "~icons/tabler/key";
  import TablerExclamationCircleFilled from "~icons/tabler/exclamation-circle-filled";
  import TablerCircleCheckFilled from "~icons/tabler/circle-check-filled";
  import { onMount } from "svelte";

  const FormState = {
    Idle: 0,
    Success: 1,
    Error: 2,
  };

  type FormState = (typeof FormState)[keyof typeof FormState];

  let token: string | null = $state(null);

  let formState = $state(FormState.Idle);
  let errorMessage = $state("");
  let errorCode = $state("");

  let newPassword = $state("");
  let confirmPassword = $state("");

  onMount(() => {
    token = new URLSearchParams(window.location.search).get("token");
  });

  async function resetPassword() {
    if (!token) {
      console.error("No token provided");
      return;
    }

    if (confirmPassword !== newPassword) {
      formState = FormState.Error;
      errorMessage = "Passwords don't match";
      errorCode = "";
      return;
    }

    const { data, error } = await authClient.resetPassword({
      newPassword,
      token,
    });

    if (error) {
      formState = FormState.Error;
      errorMessage = error.message || "";
      errorCode = error.code || "";
    } else {
      formState = FormState.Success;
    }

    console.log(data, error);
  }
</script>

<form
  class="flex w-full max-w-xs flex-col items-start gap-2 p-4"
  onsubmit={(e) => {
    e.preventDefault();
  }}
>
  <span class="m-0 text-4xl"><TablerKey /></span>
  <h1 class="mb-2 text-2xl font-semibold">Reset password</h1>
  <input
    type="password"
    name="password"
    autocomplete="new-password"
    required
    placeholder="Password"
    class="input w-full"
    bind:value={newPassword}
  />
  <input
    type="password"
    name="confirm-password"
    autocomplete="new-password"
    required
    placeholder="Confirm Password"
    class="input w-full"
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
  <div class="mt-4 flex flex-col gap-2 self-stretch text-center">
    <button class="btn btn-primary" onclick={resetPassword}>Reset</button>
    <a href="/sign-in" class="btn btn-ghost"> Back to sign in </a>
  </div>
</form>
