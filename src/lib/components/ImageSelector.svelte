<script lang="ts">
  let { imageBitmap = $bindable() } = $props();
  const uid = $props.id();

  let files: FileList = $state();
  let imageCanvas: HTMLCanvasElement = $state();

  async function onchange(event: Event) {
    if (files && files.length > 0) {
      imageBitmap = await createImageBitmap(files[0]);

      const ctx = imageCanvas.getContext("2d");
      imageCanvas.width = imageBitmap.width;
      imageCanvas.height = imageBitmap.height;
      ctx.drawImage(imageBitmap, 0, 0);
    } else {
      imageBitmap = undefined;
    }
  }
</script>

<label
  for="{uid}-file"
  class="flex aspect-square size-full cursor-pointer flex-col items-center justify-center rounded-lg border-3 border-dashed duration-200 hover:bg-gray-700 active:bg-gray-500"
>
  {#if files && files.length > 0}
    <canvas bind:this={imageCanvas} class="size-9/10 object-contain"></canvas>
  {:else}
    <svg viewBox="0 0 24 24" class="size-1/4">
      <path
        fill="white"
        d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"
      />
    </svg>
    <p class="line-clamp-1">Click to select image files</p>
  {/if}
</label>
<input id="{uid}-file" type="file" class="hidden" accept="image/*" bind:files {onchange} />
