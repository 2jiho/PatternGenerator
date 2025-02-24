<script lang="ts">
  import { generatePattern } from "$lib/functions/Pattern.svelte";
  import { debounce } from "$lib/utils";

  let distance = 1;
  let col = 5;
  let row = 5;
  let patternWidth = 2000;

  let image: HTMLImageElement | null = null;
  let pattern: HTMLCanvasElement | null = null;
  let loading = false;
  let errorMessage = "";

  async function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      const file = files[0];
      image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = async () => {
        await debouncedGeneratePattern();
        if (image) {
          URL.revokeObjectURL(image.src); // 메모리 누수 방지
        }
      };
    }
  }

  async function generatePatternHandler() {
    if (image) {
      loading = true;
      errorMessage = "";
      try {
        pattern = await generatePattern(image, distance, col, row, patternWidth);
      } catch (error: any) {
        errorMessage = error.message || "패턴 생성 중 오류가 발생했습니다.";
        pattern = null;
      } finally {
        loading = false;
      }
    }
  }

  const debouncedGeneratePattern = debounce(generatePatternHandler, 300);

  let ariaLabel = "Click to select files";
</script>

<main class="flex flex-col md:flex-row">
  <!-- 메뉴 시작 -->
  <div class="md:w-64 md:h-screen md:relative w-full bg-gray-900 text-white">
    <div class="p-2 text-lg font-bold">Image Pattern Generator</div>
    <!-- 파일 업로드 시작 -->
    <div class="p-2 hover:bg-gray-700">
      <div class="aspect-square">
        <label for="files" class="size-full border-3 border-dashed rounded-lg flex flex-col items-center justify-center">
          <svg viewBox="0 0 24 24" class="w-1/4 h-1/4">
            <path
              fill="white"
              d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"
            />
          </svg>
          <p class="line-clamp-1">{ariaLabel}</p>
        </label>
        <input id="files" type="file" accept="image/*" class="hidden" onchange={handleFileUpload} aria-label={ariaLabel} />
      </div>
    </div>
    <!-- 파일 업로드 끝 -->
    <!-- 설정 시작 -->
    <div class="p-2 hover:bg-gray-700 flex flex-col">
      <label for="distance">Distance ({distance}X)</label>
      <input type="range" id="distance" bind:value={distance} min="-0.5" max="10" step="0.1" onchange={debouncedGeneratePattern} aria-describedby="distance-value" />
      <span id="distance-value" class="text-sm">Current value: {distance}</span>
    </div>
    <div class="p-2 hover:bg-gray-700 flex flex-col">
      <label for="col">Column ({col}Ea)</label>
      <input type="range" id="col" bind:value={col} min="1" max="100" onchange={debouncedGeneratePattern} aria-describedby="col-value" />
      <span id="col-value" class="text-sm">Current value: {col}</span>
    </div>
    <div class="p-2 hover:bg-gray-700 flex flex-col">
      <label for="row">Row ({row}Ea)</label>
      <input type="range" id="row" bind:value={row} min="1" max="100" onchange={debouncedGeneratePattern} aria-describedby="row-value" />
      <span id="row-value" class="text-sm">Current value: {row}</span>
    </div>
    <div class="p-2 hover:bg-gray-700 flex flex-col">
      <label for="width">Pattern Width ({patternWidth}px)</label>
      <input type="range" id="width" bind:value={patternWidth} min="100" max="10000" step="100" onchange={debouncedGeneratePattern} aria-describedby="width-value" />
      <span id="width-value" class="text-sm">Current value: {patternWidth}</span>
    </div>
    <!-- 설정 끝 -->
    <!-- 다운로드 버튼 시작 -->
    {#if pattern}
      <div class="p-2 flex flex-col md:w-64 md:absolute md:bottom-4">
        <a href={pattern?.toDataURL()} download={`pattern(${patternWidth}px_${col}x${row}).png`}>
          <button class="w-full h-10 rounded-lg border-3 hover:bg-gray-500 active:bg-gray-700 duration-200" disabled={loading} aria-label="Download pattern image">
            {#if loading}
              Loading...
            {:else}
              Pattern Download
            {/if}
          </button>
        </a>
      </div>
    {/if}
    <!-- 다운로드 버튼 끝 -->
  </div>
  <!-- 메뉴 끝 -->
  <!-- 본문 시작 -->
  <div id="contents" class="flex-1 md:h-screen">
    {#if loading}
      <div class="size-full flex items-center justify-center">Loading...</div>
    {:else if errorMessage}
      <div class="size-full flex items-center justify-center text-red-500">
        {errorMessage}
      </div>
    {:else if pattern}
      <div class="size-full flex items-center justify-center">
        <img src={pattern?.toDataURL("image/png")} alt="Pattern preview" class="size-full object-contain" />
      </div>
    {:else}
      <div class="size-full flex items-center justify-center">
        <svg viewBox="0 0 24 24" class="size-1/2">
          <path
            fill="gray"
            d="M7.828 5l-1-1H22v15.172l-1-1v-.69l-3.116-3.117-.395.296-.714-.714.854-.64a.503.503 0 0 1 .657.046L21 16.067V5zM3 20v-.519l2.947-2.947a1.506 1.506 0 0 0 .677.163 1.403 1.403 0 0 0 .997-.415l2.916-2.916-.706-.707-2.916 2.916a.474.474 0 0 1-.678-.048.503.503 0 0 0-.704.007L3 18.067V5.828l-1-1V21h16.172l-1-1zM17 8.5A1.5 1.5 0 1 1 15.5 7 1.5 1.5 0 0 1 17 8.5zm-1 0a.5.5 0 1 0-.5.5.5.5 0 0 0 .5-.5zm5.646 13.854l.707-.707-20-20-.707.707z"
          />
          <path fill="none" d="M0 0h24v24H0z" />
        </svg>
      </div>
    {/if}
  </div>
  <!-- 본문 끝 -->
</main>
