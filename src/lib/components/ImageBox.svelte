<script lang="ts">
  // 줌 기능 구현 하기
  let { src, alt = "", noneSrcText } = $props();
</script>

{#if src}
  <div class="size-full flex items-center justify-center">
    <img {src} {alt} class="size-full object-contain" />
  </div>
{:else}
  <div class="size-full flex items-center justify-center">
    <p>{noneSrcText}</p>
  </div>
{/if}

<style>
  @reference "tailwindcss/theme";
</style>
