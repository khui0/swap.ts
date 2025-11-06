<script lang="ts">
  import { authClient } from "$lib/auth-client";
  import TablerExclamationCircleFilled from "~icons/tabler/exclamation-circle-filled";
  import TablerUserPlus from "~icons/tabler/user-plus";
  import TablerCircleCheckFilled from "~icons/tabler/circle-check-filled";

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
  <span class="m-0 text-4xl"><TablerUserPlus /></span>
  <h1 class="mb-2 text-2xl font-semibold">Create an account</h1>
  <input type="text" placeholder="Username" class="input w-full" bind:value={name} />
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
    autocomplete="new-password"
    required
    placeholder="Password"
    class="input w-full"
    bind:value={password}
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
        Check your inbox to verify your email.
      {/if}
    </p>
  {/if}
  <div class="mt-4 flex flex-col gap-2 self-stretch text-center">
    <button class="btn btn-primary" onclick={register}>
      {#if formState === FormState.Loading}
        <span class="loading loading-sm loading-spinner"></span>
      {:else}
        Create
      {/if}
    </button>
    <a href="/sign-in" class="link self-center text-sm font-medium text-base-content/80">
      Already have an account?
    </a>
  </div>
</form>
