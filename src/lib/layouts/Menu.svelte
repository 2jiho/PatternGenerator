<script lang="ts">
  import PatternGenerators from "$lib/patternGenerator";
  import { border, filename, files, paramValues, patternBitmap, patternParams, selectedPattern } from "$lib/store";
  import { Button, Dropdown, FileUploaderButton, Slider } from "carbon-components-svelte";
  import { Download } from "carbon-icons-svelte";

  const items = Object.keys(PatternGenerators).map((key) => ({
    id: key,
    text: key.charAt(0).toUpperCase() + key.slice(1),
  }));

  async function handleDownload() {
    if (!$patternBitmap) return;
    const offScreenCanvas = new OffscreenCanvas($patternBitmap.width, $patternBitmap.height);
    const ctx = offScreenCanvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage($patternBitmap, 0, 0);
    const blob = await offScreenCanvas.convertToBlob();
    const url = await URL.createObjectURL(blob);
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

<main>
  <h1>PatternGenerator</h1>
  <FileUploaderButton bind:files={$files} accept={["image/*"]} labelText="Click to select image files" size="default" />
  <Slider bind:value={$border.value} labelText="Border" min={0} max={10} step={1} maxLabel="10%" fullWidth />
  <input type="color" bind:value={$border.color} />
  <Dropdown titleText="Pattern" bind:selectedId={$selectedPattern} {items} />
  {#each $patternParams as { id, label, min, max, step, unit }}
    <Slider bind:value={$paramValues[id]} {min} {max} {step} labelText={label} maxLabel="{max}{unit}" fullWidth />
  {:else}
    <p>No parameters defined for this pattern.</p>
  {/each}
  <Button disabled={!$patternBitmap} icon={Download} onclick={handleDownload}>PatternDownload</Button>
</main>

<style>
  h1 {
    line-clamp: 1;
    font-size: 1.5rem;
    font-weight: 700;
  }
  main {
    display: grid;
    gap: 0.5rem;
    padding: 1rem;
  }
</style>
