<script lang="ts">
  import { authClient } from "$lib/auth-client";
  import type { PageProps } from "./$types";
  import TablerPencil from "~icons/tabler/pencil";
  import TablerLogout from "~icons/tabler/logout";
  import TablerPlus from "~icons/tabler/plus";

  let { data }: PageProps = $props();

  const session = authClient.useSession();
</script>

<div class="m-4 flex w-full max-w-xl flex-col gap-2">
  <div class="flex flex-wrap items-center justify-between gap-2">
    <h1 class="mb-1">swap.ts</h1>
    <div class="flex items-center gap-2">
      {#if $session.data !== null}
        <a href="/account" class="btn">
          {$session.data.user.name}
        </a>
        <button
          aria-label="Sign out"
          class="floating btn btn-circle"
          onclick={async () => {
            await authClient.signOut();
          }}
        >
          <span class="translate-x-0.5"><TablerLogout /></span>
        </button>
      {/if}
    </div>
  </div>
  {#if $session.data === null}
    <a class="btn btn-primary" href="/sign-up">Get Started</a>
    <a class="btn btn-ghost" href="/sign-in">Sign into existing account</a>
  {:else}
    <ul class="flex flex-col gap-2">
      <div class="flex h-20 items-center justify-center rounded-field border-2 border-dashed">
        <p class="text-sm font-medium text-base-content/50">You aren't in any groups</p>
      </div>
    </ul>
    <div class="grid grid-cols-2 gap-2">
      <a class="btn" href="/sign-up"><TablerPlus />Join Group</a>
      <a class="btn" href="/sign-in"><TablerPencil />Create Group</a>
    </div>
  {/if}
</div>
