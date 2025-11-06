<script lang="ts">
  import { authClient } from "$lib/auth-client";

  const session = authClient.useSession();

  session.subscribe((value) => {
    console.log(value.data);
  });
</script>

{#if $session.data === null}
  <a class="btn" href="/sign-up">New Account</a>
  <a class="btn" href="/sign-in">Sign In</a>
{:else}
  <p>{$session.data.user.name}</p>
  <button
    class="btn"
    onclick={async () => {
      await authClient.signOut();
    }}
  >
    Sign Out
  </button>
{/if}
