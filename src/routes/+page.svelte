<script lang="ts">
  import { ImageSolid } from "svelte-awesome-icons";

  import Slider from "$lib/components/Slider.svelte";
  import ImageSelector from "$lib/components/ImageSelector.svelte";
  import DownloadButton from "$lib/components/DownloadButton.svelte";
  import patternGenerator from "$lib/patternGenerator/diamond";

  let distance = 1;
  let col = 3;
  let row = 2;
  let patternWidth = 2000;

  let imageBitmap: ImageBitmap;
  let patternImageBitmap: ImageBitmap | undefined;
  let patternCanvas: HTMLCanvasElement;

  $: if (patternCanvas && patternImageBitmap) {
    patternCanvas.width = patternImageBitmap.width;
    patternCanvas.height = patternImageBitmap.height;
    const ctx = patternCanvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(patternImageBitmap, 0, 0);
    }
  }

  $: {
    (async () => {
      patternImageBitmap = await patternGenerator(imageBitmap, distance, col, row, patternWidth);
    })();
  }
</script>

<main class="flex flex-col md:flex-row">
  <!-- 메뉴 시작 -->
  <div class="w-full bg-gray-900 text-white md:relative md:h-screen md:w-64">
    <div class="line-clamp-1 p-2 text-lg font-bold">Image Pattern Generator</div>
    <div class="flex flex-col gap-2 p-2">
      <ImageSelector bind:imageBitmap />
      <Slider bind:value={distance} min="-0.5" max="3" step="0.1" unit="x" label="Distance" />
      <Slider bind:value={col} min="1" max="20" unit="ea" label="Column" />
      <Slider bind:value={row} min="1" max="20" unit="ea" label="Row" />
      <Slider bind:value={patternWidth} min="100" unit="px" max="4000" step="100" label="Pattern Width" />
    </div>

    <div class="flex flex-col p-2 md:absolute md:bottom-4 md:w-64">
      <DownloadButton {patternImageBitmap} download={`pattern(${patternWidth}px_${col}x${row}).png`} />
    </div>
  </div>
  <!-- 메뉴 끝 -->
  <!-- 본문 시작 -->
  <div class=" flex-1 md:h-screen">
    <div class="flex aspect-square size-full items-center justify-center">
      {#if patternImageBitmap}
        <canvas bind:this={patternCanvas} class="size-full object-contain"></canvas>
      {:else}
        <ImageSolid class="size-1/4 fill-gray-300" />
      {/if}
    </div>
  </div>
  <!-- 본문 끝 -->
</main>
