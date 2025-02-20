<script lang="ts">
  import Dropzone from "$lib/components/DropZone.svelte";
  import ImageBox from "$lib/components/ImageBox.svelte";

  import { generatePattern } from "$lib/functions/Pattern.svelte";
  let distance: number = $state(1);
  let col: number = $state(5);
  let row: number = $state(5);
  let patternWidth: number = $state(2000);

  let previewWidth: number = 1280;

  let image: HTMLImageElement | null = $state(null);
  let pattern: HTMLCanvasElement | null = $state(null);

  async function onfiles(files: File[]) {
    if (files) {
      image = new Image();
      image.src = URL.createObjectURL(files[0]);
      await image.decode();
      await handleGeneratePattern();
    }
  }
  async function handleGeneratePattern() {
    if (image) {
      if (document) {
        const contentsElement = document.getElementById("contents");
        if (contentsElement) {
          const maxPreviewWidthBasedOnScreenWidth = contentsElement.offsetWidth;
          const desiredAspectRatio = image.width / image.height;
          const maxHeightPerRowColumn = (contentsElement.offsetHeight / row) * col;
          const maxPreviewWidthBasedOnScreenHeight = maxHeightPerRowColumn * desiredAspectRatio;

          previewWidth = Math.min(maxPreviewWidthBasedOnScreenWidth, maxPreviewWidthBasedOnScreenHeight);
        }
        const maxPreviewWidth = 1920;
        previewWidth = Math.min(previewWidth, maxPreviewWidth);
      }
      pattern = await generatePattern(image, distance, col, row, previewWidth);
    }
  }
  async function handlePatternDownload(event: Event) {
    if (image) {
      const patternOriginal = await generatePattern(image, distance, col, row, patternWidth);
      const patternDataURL = patternOriginal.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = patternDataURL;
      link.download = `pattern(${patternWidth}px_${col}x${row}).png`;
      link.click();
    }
  }
</script>

<main class="flex flex-col md:flex-row">
  <div class="md:w-64 md:h-screen md:relative w-full bg-gray-900 text-white">
    <div class="p-2 text-lg font-bold">Image Pattern Generator</div>
    <div class="p-2 hover:bg-gray-700">
      <Dropzone accept="image/*" {onfiles} />
    </div>
    <div class="p-2 hover:bg-gray-700 flex flex-col">
      <label for="distance">Distance ({distance}X)</label>
      <input type="range" id="distance" bind:value={distance} min="-0.5" max="10" step="0.1" onchange={handleGeneratePattern} />
    </div>
    <div class="p-2 hover:bg-gray-700 flex flex-col">
      <label for="col">Column ({col}Ea)</label>
      <input type="range" id="col" bind:value={col} min="1" max="100" onchange={handleGeneratePattern} />
    </div>
    <div class="p-2 hover:bg-gray-700 flex flex-col">
      <label for="row">Row ({row}Ea)</label>
      <input type="range" id="row" bind:value={row} min="1" max="100" onchange={handleGeneratePattern} />
    </div>
    <div class="p-2 hover:bg-gray-700 flex flex-col">
      <label for="width">Pattern Width ({patternWidth}px)</label>
      <input type="range" id="width" bind:value={patternWidth} min="100" max="10000" step="100" />
    </div>
    {#if pattern}
      <div class="p-2 hover:bg-gray-700 flex flex-col md:w-64 md:absolute md:bottom-4">
        <button class="w-full h-10 rounded-lg border-3 hover:bg-gray-500 active:bg-gray-700 duration-200" onclick={handlePatternDownload}>Pattern Download</button>
      </div>
    {/if}
  </div>

  <div id="contents" class="flex-1 md:h-screen">
    <!-- TODO: 줌 가능하도록 변경할것 -->
    <ImageBox src={pattern?.toDataURL()} noneSrcText="패턴 이미지가 없습니다." alt="pattern image preview" />
  </div>
</main>

<style>
  @reference "tailwindcss/theme";
</style>
