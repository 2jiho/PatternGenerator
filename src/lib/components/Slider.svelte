<script lang="ts">
  let { value = $bindable(), label = "", unit = "", ...others } = $props();
  const uid = $props.id();
</script>

<div class="flex justify-between">
  <label for="{uid}-slider">{label}</label>
  <label for="{uid}-slider">{value}{unit}</label>
</div>
<input id="{uid}-slider" type="range" bind:value {...others} />
