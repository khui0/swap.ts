<script lang="ts">
  import { authClient } from "$lib/auth-client";
  import TablerLogout from "~icons/tabler/logout";
  import TablerPlus from "~icons/tabler/plus";
  import TablerTrash from "~icons/tabler/trash";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  let tasks = $state(data.tasks);

  const session = authClient.useSession();

  session.subscribe((value) => {
    console.log(value.data);
  });

  let taskInput = $state("");

  async function createTask() {
    const response = await fetch("/api/task", {
      method: "POST",
      body: JSON.stringify({
        content: taskInput,
      }),
    });
    taskInput = "";

    const updatedList = JSON.parse((await response.json()).tasks);
    tasks = updatedList;
  }
</script>

{#if $session.data === null}
  <div class="flex h-full w-full flex-col items-center justify-center">
    <div class="flex flex-col gap-2">
      <h1 class="text-4xl font-bold mb-2">Checklist</h1>
      <a class="btn btn-primary" href="/sign-up">Get Started</a>
      <a class="btn btn-ghost" href="/sign-in">Sign into existing account</a>
    </div>
  </div>
{:else}
  <ul class="flex h-full w-full flex-col gap-2 overflow-auto p-4 pb-18">
    {#each tasks as task (task.task.id)}
      <div class="flex gap-4 rounded-box bg-base-200 px-4 py-3">
        <input
          type="checkbox"
          class="checkbox"
          bind:checked={task.task.completed}
          oninput={async () => {
            console.log(task.task.id, task.task.completed);

            await fetch("/api/task", {
              method: "PATCH",
              body: JSON.stringify({
                id: Number(task.task.id),
                completed: !task.task.completed,
              }),
            });
          }}
        />
        <p
          class={{
            "transition-opacity": true,
            "line-through opacity-50": task.task.completed,
          }}
        >
          {task.task.content}
        </p>
      </div>
    {/each}
  </ul>
  <div
    class="absolute right-0 bottom-0 left-0 flex h-18 gap-2 bg-linear-0 from-black/10 to-transparent p-4"
  >
    <label
      class="floating input flex-1 border-white transition-transform focus-within:scale-102 focus-within:outline-none focus:outline-none"
    >
      <TablerPlus></TablerPlus>
      <input
        placeholder="{$session.data.user.name}'s list"
        type="text"
        class="grow"
        bind:value={taskInput}
        onkeydown={(e) => {
          if (e.key === "Enter") {
            createTask();
          }
        }}
      />
    </label>
    <button
      class="floating btn btn-circle"
      onclick={async () => {
        if (!confirm("Clear completed tasks?")) {
          return;
        }

        const response = await fetch("/api/task", {
          method: "DELETE",
        });

        const updatedList = JSON.parse((await response.json()).tasks);
        tasks = updatedList;
      }}
    >
      <span><TablerTrash /></span>
    </button>
    <button
      class="floating btn btn-circle"
      onclick={async () => {
        await authClient.signOut();
      }}
    >
      <span class="translate-x-0.5"><TablerLogout /></span>
    </button>
  </div>
{/if}

<style>
  @reference "../app.css";

  .floating {
    @apply border-white/50 bg-base-300/50 shadow-2xl backdrop-blur-sm;
  }
</style>
