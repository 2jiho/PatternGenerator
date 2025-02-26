<script lang="ts">
  import Slider from "$lib/components/Slider.svelte";
  import ImageSelector from "$lib/components/ImageSelector.svelte";
  import DownloadButton from "$lib/components/DownloadButton.svelte";
  import patternGenerator from "$lib/functions/patternGenerator";

  let distance = 1;
  let col = 3;
  let row = 2;
  let patternWidth = 2000;

  let imageBitmap: ImageBitmap;

  let patternOffscreenCanvas: OffscreenCanvas;
  let patternCanvas: HTMLCanvasElement;

  $: if (patternOffscreenCanvas && patternCanvas) {
    const ctx = patternCanvas.getContext("2d");
    if (ctx) {
      patternCanvas.width = patternOffscreenCanvas.width;
      patternCanvas.height = patternOffscreenCanvas.height;
      ctx.drawImage(patternOffscreenCanvas, 0, 0);
    }
  }

  $: if (imageBitmap) {
    (async () => {
      patternOffscreenCanvas = await patternGenerator(imageBitmap, distance, col, row, patternWidth);
    })();
  } else {
    patternOffscreenCanvas = undefined;
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
    {#if patternOffscreenCanvas}
      <div class="flex flex-col p-2 md:absolute md:bottom-4 md:w-64">
        <DownloadButton canvas={patternOffscreenCanvas} download={`pattern(${patternWidth}px_${col}x${row}).png`} />
      </div>
    {/if}
  </div>
  <!-- 메뉴 끝 -->
  <!-- 본문 시작 -->
  <div id="contents" class="flex-1 md:h-screen">
    <div class="flex size-full items-center justify-center">
      {#if patternOffscreenCanvas}
        <canvas bind:this={patternCanvas} class="size-full object-contain"></canvas>
      {:else}
        <svg viewBox="0 0 24 24" class="size-1/2">
          <path
            fill="gray"
            d="M7.828 5l-1-1H22v15.172l-1-1v-.69l-3.116-3.117-.395.296-.714-.714.854-.64a.503.503 0 0 1 .657.046L21 16.067V5zM3 20v-.519l2.947-2.947a1.506 1.506 0 0 0 .677.163 1.403 1.403 0 0 0 .997-.415l2.916-2.916-.706-.707-2.916 2.916a.474.474 0 0 1-.678-.048.503.503 0 0 0-.704.007L3 18.067V5.828l-1-1V21h16.172l-1-1zM17 8.5A1.5 1.5 0 1 1 15.5 7 1.5 1.5 0 0 1 17 8.5zm-1 0a.5.5 0 1 0-.5.5.5.5 0 0 0 .5-.5zm5.646 13.854l.707-.707-20-20-.707.707z"
          />
          <path fill="none" d="M0 0h24v24H0z" />
        </svg>
      {/if}
    </div>
  </div>
  <!-- 본문 끝 -->
</main>
