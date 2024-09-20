<script setup>
    import ImputButton from './ImputButton.vue'
</script>

<template>
    <div class="centerWrapper" id="hiddenFileSelector">
        <ImputButton @fileExtension="filefunction" />
    </div>
</template>
  
<script>

    function filefunction(playload)
    {
        console.log(playload);
    }

</script>

  
<style scoped>
    .centerWrapper
    {
        display: flex;
        align-items: center; 
    }
</style>
  