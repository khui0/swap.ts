<script lang="ts">
  import { authClient } from "$lib/auth-client";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  const session = authClient.useSession();
</script>

{#if $session.data === null}
  <div class="flex h-full w-full flex-col items-center justify-center">
    <div class="flex flex-col gap-2">
      <h1 class="mb-2 text-4xl font-bold">swap.ts</h1>
      <a class="btn btn-primary" href="/sign-up">Get Started</a>
      <a class="btn btn-ghost" href="/sign-in">Sign into existing account</a>
    </div>
  </div>
{/if}
