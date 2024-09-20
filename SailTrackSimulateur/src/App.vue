<script setup lang="ts">
  import FileUploader from './components/FileUploader.vue'
</script>

<template>
  <div class="fileUploaderContainer">
    <FileUploader />
  </div>
</template>

<style scoped>
  .fileUploaderContainer
  {
    margin: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
