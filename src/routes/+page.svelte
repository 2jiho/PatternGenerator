<script lang="ts">
  import { onMount } from "svelte";
  import { ImageSolid } from "svelte-awesome-icons";

  // 컴포넌트
  import Slider from "$lib/components/Slider.svelte";
  import ImageSelector from "$lib/components/ImageSelector.svelte";
  import ImageBorder from "$lib/components/ImageBorder.svelte";
  import DownloadButton from "$lib/components/DownloadButton.svelte";
  import PatternSelector from "$lib/components/PatternSelector.svelte";

  // 함수
  import PatternGenerators from "$lib/patternGenerator";

  let imageBitmap: ImageBitmap | undefined;
  let borderBitmap: ImageBitmap | undefined;
  let patternImageBitmap: ImageBitmap | undefined;
  let patternCanvas: HTMLCanvasElement | undefined;

  type PatternKey = keyof typeof PatternGenerators;
  let selectedPatternKey: PatternKey | undefined;
  type SelectedGenerator = (typeof PatternGenerators)[PatternKey];
  let selectedGenerator: SelectedGenerator | undefined;
  let patternParams: SelectedGenerator["params"] | undefined;
  type ParamValues = Record<string, number>;
  let paramValues: ParamValues = {};

  $: if (selectedPatternKey) {
    selectedGenerator = PatternGenerators[selectedPatternKey];
    patternParams = selectedGenerator.params;
    patternParams.forEach((param) => {
      paramValues[param.id] = param.default;
    });
    paramValues["canvasWidth"] = 2000;
  }

  onMount(() => {
    selectedPatternKey = Object.keys(PatternGenerators)[0] as PatternKey;
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
      if (imageBitmap && borderBitmap && selectedGenerator) {
        patternImageBitmap = await selectedGenerator.generate(borderBitmap, paramValues);
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
    <div class="flex flex-col gap-2 bg-inherit p-2">
      <ImageSelector bind:imageBitmap />
      <ImageBorder {imageBitmap} bind:borderBitmap />
      <PatternSelector bind:selectedPatternKey {PatternGenerators} />
      <!-- 슬라이더 생성 -->
      {#if patternParams}
        {#each patternParams as param (param.id)}
          <Slider bind:value={paramValues[param.id]} min={param.min} max={param.max} step={param.step} unit={param.unit} label={param.label} />
        {/each}
      {/if}
      <Slider bind:value={paramValues["canvasWidth"]} min="100" max="4000" step="100" unit="px" label="Canvas Width" />
      <DownloadButton {patternImageBitmap} download={fileName} />
    </div>
  </div>
  <!-- 메뉴 끝 -->
  <!-- 본문 시작 -->
  <div class=" flex-1 md:h-screen">
    <div class="flex aspect-square size-full items-center justify-center md:aspect-auto">
      {#if patternImageBitmap}
        <canvas
          bind:this={patternCanvas}
          class="max-h-full max-w-full bg-conic-[#ccc_0%_25%,transparent_25%_50%,#ccc_50%_75%,transparent_75%_100%] bg-[length:40px_40px] bg-center object-contain"
        ></canvas>
      {:else}
        <ImageSolid class="size-1/4 text-gray-300 " />
      {/if}
    </div>
  </div>
  <!-- 본문 끝 -->
</main>
