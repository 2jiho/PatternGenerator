<script lang="ts">
  import Canvas from "$lib/layouts/Canvas.svelte";
  import Menu from "$lib/layouts/Menu.svelte";
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto] text-xs">
  <!-- Header -->
  <header class="p-4 md:flex md:h-20"><h1 class="text-2xl md:flex md:place-items-center">PatternGenerator</h1></header>
  <!-- Page -->
  <div class="grid grid-cols-1 md:grid-cols-[auto_1fr]">
    <!-- Sidebar -->
    <aside class="p-4"><Menu /></aside>
    <!-- Main -->
    <main class="col-span-1 p-4 md:h-[calc(100vh-80px)]"><Canvas /></main>
  </div>
</div>
