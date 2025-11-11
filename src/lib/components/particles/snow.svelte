<script lang="ts">
  import snowflake from "$lib/assets/snowflake.svg";
  import { tsParticles } from "@tsparticles/engine";
  import { loadSnowPreset } from "@tsparticles/preset-snow";
  import { loadImageShape } from "@tsparticles/shape-image";
  import { onMount } from "svelte";

  onMount(async () => {
    await loadSnowPreset(tsParticles);
    await loadImageShape(tsParticles);
    await tsParticles.load({
      id: "tsparticles",
      options: {
        background: {
          opacity: 0,
        },
        particles: {
          color: { value: "#7BE4FF" },
          shape: {
            type: "image",
            options: {
              image: {
                src: snowflake,
                width: 64,
                height: 64,
                replaceColor: true,
              },
            },
          },
        },
        preset: "snow",
      },
    });
  });
</script>

<div class="pointer-events-none fixed inset-0" id="snow"></div>
