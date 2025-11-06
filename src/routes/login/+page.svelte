<script lang="ts">
  import { authClient } from "$lib/auth-client";

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
  <h1 class="mb-2 text-2xl font-semibold">Sign in</h1>
  <input type="text" placeholder="Email" class="input w-full" bind:value={email} />
  <input type="password" placeholder="Password" class="input w-full" bind:value={password} />
  <label class="label text-sm">
    <input type="checkbox" bind:checked={rememberMe} class="checkbox checkbox-sm" />
    Remember me
  </label>
  {#if formState === FormState.Error}
    <p class="self-stretch text-sm font-medium text-error">{errorMessage}</p>
  {/if}
  <div class="mt-2 flex flex-col gap-2 self-stretch text-center">
    <button class="btn btn-primary" onclick={signIn}>Sign In</button>
    <a href="/login" class="link self-center text-sm font-medium text-base-content/50">
      Don't have an account?
    </a>
  </div>
</form>
