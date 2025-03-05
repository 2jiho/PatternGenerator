<script lang="ts">
  import PatternGenerators from "$lib/patternGenerator";
  import { border, filename, files, paramValues, patternBitmap, patternParams, selectedPattern } from "$lib/store";
  import { FileUpload, Slider } from "@skeletonlabs/skeleton-svelte";
  import IconRemove from "lucide-svelte/icons/circle-x";
  import IconDropzone from "lucide-svelte/icons/image-plus";
  import IconFile from "lucide-svelte/icons/paperclip";

  const items = Object.keys(PatternGenerators).map((key) => ({
    id: key,
    text: key.charAt(0).toUpperCase() + key.slice(1),
  }));

  async function handleDownload() {
    if (!$patternBitmap) return;
    const offScreenCanvas = new OffscreenCanvas($patternBitmap.width, $patternBitmap.height);
    offScreenCanvas.getContext("bitmaprenderer")?.transferFromImageBitmap($patternBitmap);
    const url = URL.createObjectURL(await offScreenCanvas.convertToBlob());
    const a = document.createElement("a");
    a.href = url;
    a.download = $filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
  }
</script>

<main class="card preset-filled-surface-100-900 border-surface-200-800 divide-surface-300-700 grid gap-6 border-[1px] p-4 md:gap-4">
  <section class="col-span-full grid gap-6 md:gap-4">
    <FileUpload name="example" accept="image/*" onFileAccept={(e) => ($files = e.files)} classes=" w-full">
      {#snippet iconInterface()}<IconDropzone class="size-8" />{/snippet}
      {#snippet iconFile()}<IconFile class="size-4" />{/snippet}
      {#snippet iconFileRemove()}<IconRemove class="size-4" />{/snippet}
    </FileUpload>
  </section>
  <section class="grid gap-6 md:gap-4">
    <p>Pattern</p>
    <select class="select" bind:value={$selectedPattern}>
      {#each items as { id, text }}
        <option value={id}>{text}</option>
      {/each}
    </select>
  </section>
  <section class="grid gap-6 md:gap-4">
    <p>Border({$border.value}%)</p>
    <Slider value={[$border.value]} min={0} max={10} step={1} onValueChange={(e) => ($border.value = e.value[0])} />
    <div class="grid grid-cols-[auto_1fr] gap-2">
      <input class="input" type="color" bind:value={$border.color} />
      <input class="input" type="text" bind:value={$border.color} readonly tabindex="-1" />
    </div>
  </section>
  {#each $patternParams as { id, label, min, max, step, unit }}
    <section class="grid gap-6 md:gap-4">
      <p>{label}({$paramValues[id]}{unit})</p>
      <Slider value={[$paramValues[id]]} {min} {max} {step} onValueChange={(e) => ($paramValues[id] = e.value[0])} />
    </section>
  {/each}
  <section class="grid gap-6 md:gap-4">
    <button type="button" class="btn preset-filled-surface-500" disabled={!$patternBitmap} onclick={handleDownload}> PatternDownload </button>
  </section>
</main>
