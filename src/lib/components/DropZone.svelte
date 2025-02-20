<script lang="ts">
  let { accept = "*", onfiles } = $props();
  let dragOver = $state(false);
  let fileInput: HTMLInputElement;
  let files: File[] = $state([]);

  function ondragenter(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    dragOver = true;
  }

  function ondragleave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    dragOver = false;
  }

  function ondrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    dragOver = false;
    dispatchFilesEvent(event.dataTransfer?.files);
  }

  function onclick(event: MouseEvent) {
    fileInput.click();
  }

  function onkeydown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      fileInput.click();
    }
  }

  function onchange(event: Event) {
    const target = event.target as HTMLInputElement;
    dispatchFilesEvent(target.files);
  }

  function dispatchFilesEvent(newfiles: FileList | null | undefined) {
    if (newfiles) {
      const droppedFiles = Array.from(newfiles);
      const acceptedFiles = droppedFiles.filter((file) => {
        const fileType = file.type || "";
        const fileName = file.name;
        const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";

        // Split accept string into array and trim whitespace from each item
        const acceptList = (accept || "").split(",").map((item) => item.trim());

        return acceptList.some((acceptItem) => {
          if (acceptItem === "*") {
            // Accept all files
            return true;
          } else if (acceptItem.startsWith(".")) {
            // Compare file extension with accept pattern (case-insensitive)
            const acceptExtension = acceptItem.substring(1).toLowerCase();
            return fileExtension === acceptExtension;
          } else if (acceptItem.includes("/")) {
            // Handle MIME type patterns like "image/*"
            const [mimeBase, mimeSub] = acceptItem.split("/");
            if (mimeSub === "*") {
              // Check if the file's MIME type starts with the specified base
              return fileType.startsWith(`${mimeBase}/`);
            }
            // Exact MIME type match
            return fileType === acceptItem;
          }
          return false;
        });
      });
      files = acceptedFiles && acceptedFiles.length > 0 ? [acceptedFiles[0]] : [];
      onfiles(files);
    }
  }
</script>

<div class="border-3 border-dashed rounded-lg h-60" role="button" tabindex="0" {ondragenter} {ondragleave} {ondrop} ondragover={(e) => e.preventDefault()} {onclick} {onkeydown}>
  <input type="file" {accept} bind:this={fileInput} class="hidden" {onchange} />
  <div class="flex flex-col items-center justify-center w-full h-full">
    {#if files?.length == 0}
      <div class="w-16 h-16">
        <svg viewBox="0 0 24 24">
          <path
            fill="white"
            d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"
          />
        </svg>
      </div>
      <p>Drag and drop files here.</p>
      <p>Or click to select files.</p>
    {:else}
      {#each files as file}
        <img src={URL.createObjectURL(file)} alt={file.name} class="object-contain w-full h-full" />
      {/each}
    {/if}
  </div>
</div>

<style>
  @reference "tailwindcss/theme";
</style>
