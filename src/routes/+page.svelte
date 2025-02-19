<script lang="ts">
  import ImageBox from "$lib/component/ImageBox.svelte";
  import { generatePattern } from "$lib/function/Pattern.svelte";

  let files: FileList | null = null;
  let distance: number = 1;
  let col: number = 5;
  let row: number = 5;
  let canvasWidth: number = 2000;

  let image: HTMLImageElement | null = null;
  let pattern: HTMLCanvasElement | null = null;

  async function handleFileChange() {
    if (files) {
      image = new Image();
      image.src = URL.createObjectURL(files[0]);
      await image.decode();
      await handleGeneratePattern();
    }
  }

  async function handleGeneratePattern() {
    if (image) {
      pattern = await generatePattern(image, distance, col, row, canvasWidth);
    }
  }
</script>

<main class="flex flex-col gap-2 w-1/2 mx-auto">
  <h1 class="text-3xl font-bold text-center">Image Pattern Generator</h1>
  <div class="m-2 rounded-lg outline">
    <input
      type="file"
      id="image"
      name="image"
      accept="image/*"
      bind:files
      class="rounded-lg file:p-2 file:bg-gray-200 hover:file:bg-gray-300 active:file:bg-gray-500 file:duration-200"
      onchange={handleFileChange}
    />
  </div>
  <div class="m-2 p-2 rounded-lg outline">
    <div>
      <label for="distance">패턴 거리 (배)</label>
      <input type="number" id="distance" bind:value={distance} min="-0.5" max="10" step="0.1" onchange={handleGeneratePattern} class="m-1 rounded-sm outline" />
    </div>
    <div>
      <label for="col">가로 (개)</label>
      <input type="number" id="col" bind:value={col} min="1" max="100" onchange={handleGeneratePattern} class="m-1 rounded-sm outline" />
    </div>
    <div>
      <label for="row">세로 (개)</label>
      <input type="number" id="row" bind:value={row} min="1" max="100" onchange={handleGeneratePattern} class="m-1 rounded-sm outline" />
    </div>
    <div>
      <label for="width">패턴 가로 크기 (px)</label>
      <input type="number" id="width" bind:value={canvasWidth} min="100" max="10000" step="100" onchange={handleGeneratePattern} class="m-1 rounded-sm outline" />
    </div>
  </div>
  <div class="flex gap-2 m-2">
    <div class="w-1/6">
      <ImageBox src={image?.src} noneImageText="이미지가 없습니다." />
    </div>
    <div class="w-1/6"></div>
    <div class="w-4/6">
      {#if pattern}
        <a href={pattern?.toDataURL()} download="pattern.png" class="w-full">
          <button class="w-full mb-2 p-2 rounded-lg outline bg-gray-200 hover:bg-gray-300 active:bg-gray-500 duration-200">Download</button>
        </a>
      {/if}
      <ImageBox src={pattern?.toDataURL()} noneImageText="패턴 이미지가 없습니다." />
    </div>
  </div>
</main>

<style>
  @reference "tailwindcss/theme";
</style>
