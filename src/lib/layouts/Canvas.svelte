<script lang="ts">
  import { patternBitmap } from "$lib/store";
  import { ImageOff } from "lucide-svelte";

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

<main class="grid place-items-center p-4">
  {#if $patternBitmap}
    <canvas
      bind:this={canvas}
      class="max-w-full bg-conic-[var(--color-surface-500)_0%_25%,transparent_25%_50%,var(--color-surface-500)_50%_75%,transparent_75%_100%] bg-[length:40px_40px] bg-center md:max-h-[calc(100vh-80px-32px-32px)]"
    ></canvas>
  {:else}
    <ImageOff class="text-surface-500 max-w-full object-contain md:max-h-[calc(100vh-80px-32px-32px)]" size="100%" />
  {/if}
</main>
