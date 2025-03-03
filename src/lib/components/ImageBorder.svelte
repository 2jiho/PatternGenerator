<script lang="ts">
  import Slider from "$lib/components/Slider.svelte";

  let { imageBitmap, borderBitmap = $bindable() } = $props();
  const uid = $props.id();

  let borderWidthRatio: number = $state(0); // 테두리 두께 비율
  let borderColor: string = $state("#ffffff"); // 테두리 색상

  function debounce<T extends (...args: any[]) => any>(func: T, delay: number = 200): (...args: Parameters<T>) => void {
    let debounceTimer: NodeJS.Timeout | undefined;
    return (...args: Parameters<T>) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func(...args), delay);
    };
  }

  async function drawBorderBitmap() {
    if (!imageBitmap) return;

    if (borderWidthRatio === 0) {
      borderBitmap = imageBitmap;
      return;
    }

    const imgW = imageBitmap.width;
    const imgH = imageBitmap.height;
    const borderWidth = Math.ceil((Math.max(imgW, imgH) * borderWidthRatio) / 100);

    const canvasW = imgW + borderWidth * 2;
    const canvasH = imgH + borderWidth * 2;
    const canvas = new OffscreenCanvas(canvasW, canvasH);
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    try {
      ctx.shadowColor = borderColor;
      ctx.shadowBlur = borderWidth;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.drawImage(imageBitmap, borderWidth, borderWidth);

      const imageData = ctx.getImageData(0, 0, canvasW, canvasH);
      const data = imageData.data;

      for (let i = 3; i < data.length; i += 4) {
        data[i] = data[i] > 10 ? 255 : 0;
      }

      ctx.putImageData(imageData, 0, 0);
      borderBitmap = await createImageBitmap(canvas);
    } catch (error) {
      console.error("Error drawing border:", error);
      borderBitmap = imageBitmap;
    }
  }

  const debouncedDrawBorderBitmap = debounce(drawBorderBitmap, 100);

  $effect(() => {
    if (imageBitmap && borderWidthRatio && borderColor) {
      debouncedDrawBorderBitmap();
    }
  });
</script>

<div class="flex h-full w-full flex-col">
  <Slider label="Border" unit="%" max={10} bind:value={borderWidthRatio} />
  <div class="flex items-center gap-2">
    <label for="{uid}-color">Color:</label>
    <input type="color" id="{uid}-color" bind:value={borderColor} />
  </div>
</div>
