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
    const imgW = imageBitmap.width;
    const imgH = imageBitmap.height;
    const borderWidth = Math.ceil((Math.max(imgW, imgH) * borderWidthRatio) / 100);

    const canvasW = imgW + borderWidth * 2;
    const canvasH = imgH + borderWidth * 2;
    const canvas = new OffscreenCanvas(canvasW, canvasH);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.shadowColor = borderColor;
    ctx.shadowBlur = 0;
    const steps = 32;
    for (let i = 0; i < steps; i++) {
      const angle = (i * 2 * Math.PI) / steps;
      ctx.shadowOffsetX = borderWidth * Math.cos(angle);
      ctx.shadowOffsetY = borderWidth * Math.sin(angle);
      ctx.drawImage(imageBitmap, borderWidth, borderWidth);
    }
    borderBitmap = await createImageBitmap(canvas);
  }

  const debouncedDrawBorderBitmap = debounce(drawBorderBitmap, 1);

  $effect(() => {
    if (imageBitmap) {
      if (borderWidthRatio !== 0 && borderColor) {
        debouncedDrawBorderBitmap();
      } else {
        borderBitmap = imageBitmap;
      }
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
