<script lang="ts">
  import Canvas from "$lib/layouts/Canvas.svelte";
  import Menu from "$lib/layouts/Menu.svelte";
  import { Switch } from "@skeletonlabs/skeleton-svelte";
  import IconMoon from "lucide-svelte/icons/moon";
  import IconSun from "lucide-svelte/icons/sun";
  import { onMount } from "svelte";

  let darkMode = false;
  function handleModeChange(checked: boolean) {
    darkMode = checked;
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkMode);
  }
  onMount(() => {
    darkMode = localStorage.getItem("theme") === "dark";
    document.documentElement.classList.toggle("dark", darkMode);
  });
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto] text-xs">
  <!-- Header -->
  <header class="justify-between p-4 md:flex md:h-20">
    <h1 class="text-2xl md:flex md:place-items-center">PatternGenerator</h1>
    <Switch name="mode" controlActive="bg-surface-200" checked={darkMode} onCheckedChange={(e) => handleModeChange(e.checked)}>
      {#snippet inactiveChild()}<IconMoon size="14" />{/snippet}
      {#snippet activeChild()}<IconSun size="14" />{/snippet}
    </Switch>
  </header>
  <!-- Page -->
  <div class="grid grid-cols-1 md:grid-cols-[auto_1fr]">
    <!-- Sidebar -->
    <aside class="p-4"><Menu /></aside>
    <!-- Main -->
    <main class="col-span-1 p-4 md:h-[calc(100vh-80px)]"><Canvas /></main>
  </div>
</div>
