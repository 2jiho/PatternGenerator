<script lang="ts">
  import { patternBitmap } from "$lib/store";
  import { Image } from "carbon-icons-svelte";

  let canvas: HTMLCanvasElement;
  $: if (canvas && $patternBitmap) {
    canvas.width = $patternBitmap.width;
    canvas.height = $patternBitmap.height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage($patternBitmap, 0, 0);
    }
  }
</script>

<main>
  {#if $patternBitmap}
    <canvas bind:this={canvas}></canvas>
  {:else}
    <Image width="80%" height="80%" fill="gray" />
  {/if}
</main>

<style>
  main {
    display: grid;
    place-items: center;
    gap: 0.5rem;
    padding: 1rem;
  }
  canvas {
    max-width: 80%;
  }
</style>
