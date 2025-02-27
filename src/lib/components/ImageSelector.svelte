<script lang="ts">
  import { UploadSolid } from "svelte-awesome-icons";
  let { imageBitmap = $bindable() } = $props();
  const uid = $props.id();

  let files: FileList | undefined = $state();
  let imageCanvas: HTMLCanvasElement | undefined = $state();

  async function onchange(event: Event) {
    if (files && files.length > 0) {
      imageBitmap = await createImageBitmap(files[0]);
      if (imageCanvas) {
        imageCanvas.width = imageBitmap.width;
        imageCanvas.height = imageBitmap.height;
        const ctx = imageCanvas?.getContext("2d");
        if (ctx) {
          ctx.drawImage(imageBitmap, 0, 0);
        }
      }
    } else {
      imageBitmap = undefined;
    }
  }
</script>

<label
  for="{uid}-file"
  class="flex aspect-square size-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-3 border-dashed duration-200 hover:bg-gray-700 active:bg-gray-500"
>
  {#if files && files.length > 0}
    <canvas bind:this={imageCanvas} class="size-9/10 object-contain"></canvas>
  {:else}
    <UploadSolid class="size-1/4" />
    <p class="line-clamp-1">Click to select image files</p>
  {/if}
</label>
<input id="{uid}-file" type="file" class="hidden" accept="image/*" bind:files {onchange} />
