<script lang="ts">
  import { onMount } from "svelte";
  import { ImageSolid } from "svelte-awesome-icons";

  import Slider from "$lib/components/Slider.svelte";
  import ImageSelector from "$lib/components/ImageSelector.svelte";
  import DownloadButton from "$lib/components/DownloadButton.svelte";
  import { DiamondPatternGenerator } from "$lib/patternGenerator/diamond";

  const patternGenerators = { diamond: new DiamondPatternGenerator() };

  let imageBitmap: ImageBitmap;
  let patternImageBitmap: ImageBitmap | undefined;
  let patternCanvas: HTMLCanvasElement;

  type PatternKey = keyof typeof patternGenerators;
  let selectedPatternKey: PatternKey;
  let selectedGenerator: (typeof patternGenerators)[PatternKey];
  let patternParams: (typeof patternGenerators)[PatternKey]["params"];
  $: if (selectedPatternKey) {
    selectedGenerator = patternGenerators[selectedPatternKey];
    patternParams = selectedGenerator.params;
    patternParams.forEach((param) => {
      paramValues[param.id] = param.default;
    });
    paramValues["canvasWidth"] = 2000;
  }

  let paramValues: Record<string, number> = {};

  onMount(() => {
    selectedPatternKey = "diamond";
  });

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
      if (imageBitmap && selectedGenerator) {
        patternImageBitmap = await selectedGenerator.generate(imageBitmap, paramValues);
      } else {
        patternImageBitmap = undefined;
      }
    })();
  }

  let fileName: string;
  $: fileName = `${selectedPatternKey}-pattern(${Object.entries(paramValues)
    .map(([key, value]) => `${key}-${value}`)
    .join(",")}).png`;
</script>

<main class="flex flex-col md:flex-row">
  <!-- 메뉴 시작 -->
  <div class="w-full bg-gray-900 text-white md:relative md:h-screen md:w-64">
    <div class="line-clamp-1 p-2 text-lg font-bold">Image Pattern Generator</div>
    <div class="flex flex-col gap-2 p-2">
      <ImageSelector bind:imageBitmap />
      <!-- 패턴 선택기 -->
      <div class="mb-2">
        <label for="pattern-select" class="mb-1 block text-sm">패턴 타입</label>
        <select id="pattern-select" class="w-full rounded bg-gray-700 px-2 py-1 text-white" bind:value={selectedPatternKey}>
          {#each Object.keys(patternGenerators) as patternKey}
            <option value={patternKey}>
              {patternKey.charAt(0).toUpperCase() + patternKey.slice(1)}
            </option>
          {/each}
        </select>
      </div>
      <!-- 동적 슬라이더 생성 -->
      {#each patternParams as param (param.id)}
        <Slider bind:value={paramValues[param.id]} min={param.min} max={param.max} step={param.step} unit={param.unit} label={param.label} />
      {/each}
      <Slider bind:value={paramValues["canvasWidth"]} min="100" max="4000" step="100" unit="px" label="Canvas Width" />
    </div>
    <div class="flex flex-col p-2 md:absolute md:bottom-4 md:w-64">
      <DownloadButton {patternImageBitmap} download={fileName} />
    </div>
  </div>
  <!-- 메뉴 끝 -->
  <!-- 본문 시작 -->
  <div class=" flex-1 md:h-screen">
    <div class="flex aspect-square size-full items-center justify-center md:aspect-auto">
      {#if patternImageBitmap}
        <canvas bind:this={patternCanvas} class="size-full object-contain"></canvas>
      {:else}
        <ImageSolid class="size-1/4 fill-gray-300" />
      {/if}
    </div>
  </div>
  <!-- 본문 끝 -->
</main>
