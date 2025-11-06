<script lang="ts">
  import { authClient } from "$lib/auth-client";

  const FormState = {
    Idle: 0,
    Loading: 1,
    Success: 2,
    Error: 3,
  };

  type FormState = (typeof FormState)[keyof typeof FormState];

  let email: string = $state("");
  let password: string = $state("");
  let name: string = $state("");
  let image: string = $state("");

  let formState = $state(FormState.Idle);
  let errorMessage = $state("");

  async function register() {
    const { data, error } = await authClient.signUp.email(
      {
        email,
        password,
        name,
        image,
        callbackURL: "/",
      },
      {
        onRequest: (ctx) => {
          formState = FormState.Loading;
        },
        onSuccess: (ctx) => {
          formState = FormState.Success;
        },
        onError: (ctx) => {
          formState = FormState.Error;
          errorMessage = ctx.error.message;
        },
      },
    );
  }
</script>

<form
  class="flex w-full max-w-xs flex-col items-start gap-2 p-4"
  onsubmit={(e) => {
    e.preventDefault();
  }}
>
  <h1 class="mb-2 text-2xl font-semibold">Create an account</h1>
  <input type="text" placeholder="Username" class="input w-full" bind:value={name} />
  <input type="text" placeholder="Email" class="input w-full" bind:value={email} />
  <input type="password" placeholder="Password" class="input w-full" bind:value={password} />
  {#if formState === FormState.Error}
    <p class="self-stretch text-sm font-medium text-error">{errorMessage}</p>
  {/if}
  <div class="mt-2 flex flex-col gap-2 self-stretch text-center">
    <button class="btn btn-primary" onclick={register}>
      {#if formState === FormState.Loading}
        <span class="loading loading-sm loading-spinner"></span>
      {:else}
        Create
      {/if}
    </button>
    <a href="/login" class="link self-center text-sm font-medium text-base-content/50">
      Already have an account?
    </a>
  </div>
</form>
