<script lang="ts">
  import { authClient } from "$lib/auth-client";
  import TablerExclamationCircleFilled from "~icons/tabler/exclamation-circle-filled";
  import TablerLogin2 from "~icons/tabler/login-2";
  import TablerAlertTriangleFilled from "~icons/tabler/alert-triangle-filled";
  import TablerCircleCheckFilled from "~icons/tabler/circle-check-filled";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";

  const FormState = {
    Idle: 0,
    Error: 1,
  };

  type FormState = (typeof FormState)[keyof typeof FormState];

  let email: string = $state("");
  let password: string = $state("");
  let rememberMe: boolean = $state(false);

  let formState = $state(FormState.Idle);
  let errorMessage = $state("");
  let errorCode = $state("");

  let sentVerify = $state(false);
  let sentReset = $state(false);

  async function signIn() {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
      rememberMe,
    });
    if (error) {
      formState = FormState.Error;
      errorMessage = error.message || "";
      errorCode = error.code || "";
    } else {
      formState = FormState.Idle;
    }
  }

  async function resendVerifyEmail() {
    sentVerify = true;
    await authClient.sendVerificationEmail({
      email,
      callbackURL: "/",
    });
  }

  async function requestPasswordReset() {
    sentReset = true;
    await authClient.requestPasswordReset({
      email,
      redirectTo: page.url.origin + "/reset-password",
    });
  }
</script>

<span class="m-0 text-4xl"><TablerLogin2 /></span>
<h1 class="mb-2 text-2xl font-semibold">Sign in to swap.ts</h1>
<input
  type="email"
  name="email"
  autocomplete="email"
  required
  placeholder="Email"
  class="input w-full"
  bind:value={email}
/>
<input
  type="password"
  name="password"
  autocomplete="current-password"
  required
  placeholder="Password"
  class="input w-full"
  bind:value={password}
/>
<label class="label text-sm">
  <input type="checkbox" bind:checked={rememberMe} class="checkbox checkbox-sm" />
  Remember me
</label>
{#if formState === FormState.Error}
  <p class="self-stretch text-sm font-medium text-base-content/80">
    {#if errorCode === "EMAIL_NOT_VERIFIED"}
      <span class="text-lg text-warning">
        <TablerAlertTriangleFilled class="inline h-[1.2em] w-[1.2em] align-middle" />
      </span>
      Pending email verification.
      {#if sentVerify}
        An email has been sent.
      {:else}
        <button type="button" class="btn btn-xs" onclick={resendVerifyEmail}>Resend</button>
      {/if}
    {:else if errorCode === "INVALID_EMAIL_OR_PASSWORD"}
      {#if sentReset}
        <span class="text-lg text-success">
          <TablerCircleCheckFilled class="inline h-[1.2em] w-[1.2em] align-middle" />
        </span>
        If an account with this email exists, an email has been sent.
      {:else}
        <span class="text-lg text-error">
          <TablerExclamationCircleFilled class="inline h-[1.2em] w-[1.2em] align-middle" />
        </span>
        {errorMessage}
        <button type="button" class="btn btn-xs" onclick={requestPasswordReset}>
          Reset Password
        </button>
      {/if}
    {:else}
      <span class="text-lg text-error">
        <TablerExclamationCircleFilled class="inline h-[1.2em] w-[1.2em] align-middle" />
      </span>
      {errorMessage}
    {/if}
  </p>
{/if}
<div class="mt-4 flex flex-col gap-2 self-stretch text-center">
  <button class="btn btn-primary" onclick={signIn}>Sign In</button>
  <button
    class="btn btn-ghost"
    onclick={() => {
      goto("/sign-up", { replaceState: true });
    }}
  >
    Don't have an account?
  </button>
</div>
