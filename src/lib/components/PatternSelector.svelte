<script lang="ts">
  let { PatternGenerators, selectedPatternKey = $bindable() } = $props();
  const uid = $props.id();
</script>

<div class="flex flex-col gap-2 bg-inherit">
  <label for="{uid}-select">Pattern Type</label>
  <select
    id="{uid}-select"
    class="h-10 w-full cursor-pointer rounded-lg border-3 bg-inherit hover:bg-gray-700 focus:outline-none"
    bind:value={selectedPatternKey}
  >
    {#each Object.keys(PatternGenerators) as patternKey}
      <option value={patternKey}>
        {patternKey.charAt(0).toUpperCase() + patternKey.slice(1)}
      </option>
    {/each}
  </select>
</div>
