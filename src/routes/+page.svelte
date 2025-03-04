<script lang="ts">
  import Canvas from "$lib/layouts/Canvas.svelte";
  import Menu from "$lib/layouts/Menu.svelte";
</script>

<main>
  <Menu />
  <Canvas />
</main>

<style>
  main {
    width: 100%;
    height: 100dvh;
  }
</style>
