<script lang="ts">
  let { canvas, download } = $props();

  async function onclick() {
    const blob = await canvas.convertToBlob({ type: "image/png", quality: 0.95 });
    const url = URL.createObjectURL(blob);
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

<button class="h-10 w-full rounded-lg border-3 duration-200 hover:bg-gray-700 active:bg-gray-500" {onclick}> Pattern Download </button>
