<script lang="ts">
  import { authClient } from "$lib/auth-client";
  import TablerExclamationCircleFilled from "~icons/tabler/exclamation-circle-filled";
  import TablerLogin2 from "~icons/tabler/login-2";
  import TablerAlertTriangleFilled from "~icons/tabler/alert-triangle-filled";
  import { page } from "$app/state";

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
    console.log(error?.code);
  }

  async function resendVerifyEmail() {
    await authClient.sendVerificationEmail({
      email,
      callbackURL: "/",
    });
  }

  async function requestPasswordReset() {
    await authClient.requestPasswordReset({
      email,
      redirectTo: page.url.origin + "/reset-password",
    });
  }
</script>

<form
  class="flex w-full max-w-xs flex-col items-start gap-2 p-4"
  onsubmit={(e) => {
    e.preventDefault();
  }}
>
  <span class="m-0 text-4xl"><TablerLogin2 /></span>
  <h1 class="mb-2 text-2xl font-semibold">Sign in</h1>
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
    <p
      class="inline-flex flex-wrap items-center gap-1 self-stretch text-sm font-medium text-base-content/80"
    >
      {#if errorCode === "EMAIL_NOT_VERIFIED"}
        <span class="text-lg text-warning"><TablerAlertTriangleFilled /></span>
        Pending email verification.
        <button type="button" class="btn btn-xs" onclick={resendVerifyEmail}>Resend</button>
      {:else if errorCode === "INVALID_EMAIL_OR_PASSWORD"}
        <span class="text-lg text-error"><TablerExclamationCircleFilled /></span>
        {errorMessage}
        <button type="button" class="btn btn-xs" onclick={requestPasswordReset}
          >Reset Password</button
        >
      {:else}
        <span class="text-lg text-error"><TablerExclamationCircleFilled /></span>
        {errorMessage}
      {/if}
    </p>
  {/if}
  <div class="mt-4 flex flex-col gap-2 self-stretch text-center">
    <button class="btn btn-primary" onclick={signIn}>Sign In</button>
    <a href="/sign-up" class="link self-center text-sm font-medium text-base-content/80">
      Don't have an account?
    </a>
  </div>
</form>
