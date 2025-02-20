<script lang="ts">
  import Dropzone from "$lib/components/DropZone.svelte";
  import ImageBox from "$lib/components/ImageBox.svelte";

  import { generatePattern } from "$lib/functions/Pattern.svelte";
  let distance: number = $state(1);
  let col: number = $state(5);
  let row: number = $state(5);
  let patternWidth: number = $state(2000);

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
      pattern = await generatePattern(image, distance, col, row, patternWidth);
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
      <input type="range" id="width" bind:value={patternWidth} min="100" max="10000" step="100" onchange={handleGeneratePattern} />
    </div>
    {#if pattern}
      <div class="p-2 hover:bg-gray-700 flex flex-col md:w-64 md:absolute md:bottom-4">
        <a href={pattern?.toDataURL()} download="pattern.png" class="w-full">
          <button class="w-full h-10 rounded-lg border-3 hover:bg-gray-500 active:bg-gray-700 duration-200">Pattern Download</button>
        </a>
      </div>
    {/if}
  </div>

  <div class="flex-1 md:h-screen">
    <!-- TODO: 줌 가능하도록 변경할것 -->
    <ImageBox src={pattern?.toDataURL()} noneSrcText="패턴 이미지가 없습니다." alt="pattern image" />
  </div>
</main>

<style>
  @reference "tailwindcss/theme";
</style>
