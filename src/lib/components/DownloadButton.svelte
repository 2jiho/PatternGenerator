<script lang="ts">
  import { DownloadSolid } from "svelte-awesome-icons";
  let { patternImageBitmap, download } = $props();

  async function onclick() {
    const offScreenCanvas = new OffscreenCanvas(patternImageBitmap.width, patternImageBitmap.height);
    const ctx = offScreenCanvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(patternImageBitmap, 0, 0);
    const blob = await offScreenCanvas.convertToBlob();
    const url = await URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = download;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
  }
</script>

<button
  {onclick}
  disabled={!patternImageBitmap}
  class="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-3 duration-200 hover:bg-gray-700 active:bg-gray-500 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-500 disabled:hover:bg-gray-700 disabled:active:bg-gray-700"
>
  <DownloadSolid />
  <p>Pattern Download</p>
</button>
