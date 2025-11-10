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

  const session = authClient.useSession();

  let formState = $state(FormState.Idle);
  let errorMessage = $state("");
  let errorCode = $state("");

  let newEmail = $state("");

  session.subscribe((value) => {
    if (!value.data) return;
    newEmail = value.data.user.email;
  });

  async function changeEmail() {
    const { error } = await authClient.changeEmail({
      newEmail,
      callbackURL: "/",
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

<input
  type="email"
  autocomplete="email"
  class="input w-full"
  placeholder="New Email"
  bind:value={newEmail}
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
      An email has been sent to your current email. Check your inbox to confirm the change.
    {/if}
  </p>
{/if}
<button class="btn" onclick={changeEmail}>Change</button>
