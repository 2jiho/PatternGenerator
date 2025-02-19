<script lang="ts">
  let { src, noneImageText } = $props();
</script>

{#if src}
  <div class="w-full">
    <img {src} alt="" class="p-2 rounded-lg outline" />
  </div>
{:else}
  <div class="w-full">
    <div class="p-2 rounded-lg outline">{noneImageText}</div>
  </div>
{/if}

<style>
  @reference "tailwindcss/theme";
</style>
