<script lang="ts">
  let { value = $bindable(), label = "", unit = "", ...others } = $props();
  const uid = $props.id();
</script>

<main class="flex flex-col gap-2">
  <div class="flex justify-between">
    <label for="{uid}-slider">{label}</label>
    <label for="{uid}-slider">{value}{unit}</label>
  </div>
  <div class="relative">
    <input
      id="{uid}-slider"
      type="range"
      bind:value
      {...others}
      class="focus:ring-opacity-50 h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-500 accent-blue-600 hover:bg-gray-300 hover:accent-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
  </div>
</main>
