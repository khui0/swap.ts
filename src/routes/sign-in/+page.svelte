<script lang="ts">
  import { authClient } from "$lib/auth-client";
  import TablerExclamationCircleFilled from "~icons/tabler/exclamation-circle-filled";
  import TablerLogin2 from "~icons/tabler/login-2";

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
    } else {
      formState = FormState.Idle;
    }
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
    <p class="inline-flex items-center gap-1 self-stretch text-sm font-medium text-base-content/80">
      <span class="text-lg text-error"><TablerExclamationCircleFilled /></span>
      {errorMessage}
    </p>
  {/if}
  <div class="mt-4 flex flex-col gap-2 self-stretch text-center">
    <button class="btn btn-primary" onclick={signIn}>Sign In</button>
    <a href="/sign-up" class="link self-center text-sm font-medium text-base-content/80">
      Don't have an account?
    </a>
  </div>
</form>
