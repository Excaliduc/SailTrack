<script setup>
    import { ref, watch } from 'vue';
    import * as FileManager from '@/services/FileManager.ts'

    const allowedExtensions = ["txt","csv"];
    const emit = defineEmits(['file'])

    function fileReader(event)
    {
        const file = event.target.files[0];
        console.log(file);

        if (file) {
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();
            emit('file', fileExtension);
            // if (allowedExtensions.includes(fileExtension)) {
            //     fileTitle.innerHTML = fileName;
            //     parseCSV(file);
            // } else {
            //     fileExtensionMessage.innerHTML = "Extension de fichier non autorisée.";
            //     fileExtensionMessage.style.display = "block";
            //     fileInput.value = "";
            // }
        } 
        // else {
        //     fileExtensionMessage.innerHTML = "Aucun fichier sélectionné.";
        //     fileExtensionMessage.style.display = "block";
        //     fileContent.textContent = "";
        // }
    }
</script>

<template>
        <div class="inputWrapper">
            <input @change="fileReader" class="fileInput" type="file" id="fileInput">
            <span class="fileIcon"></span>
            <span class="fileTitle">Upload File</span>
            <!-- TODO faire un drop area -->
        </div>
</template>
    
<style scoped>
    .inputWrapper {
        overflow: hidden;
        position: relative;
        cursor: pointer;
        /*Using a background color, but you can use a background image to represent a button*/
        border-radius: 4px;
        padding: 0 16px;
        height: 40px;
        background-color: white;
        border: 1px solid rgba(0, 0, 0, 0.16);
        margin-right: 16px;
        width: 132px;
        color: blue;
        display: flex;
        justify-content: center;
        align-items: center;
        column-gap: 8px;
    }

    .fileInput {
        cursor: pointer;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 99;
        /*This makes the button huge. If you want a bigger button, increase the font size*/
        font-size: 50px;
        /*Opacity settings for all browsers*/
        opacity: 0;
        -moz-opacity: 0;
        filter: progid:DXImageTransform.Microsoft.Alpha(opacity=0)
    }

    .fileIcon {
        height: 20px;
        width: 20px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230964B0'%3E%3Cpath d='M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5z'/%3E%3C/svg%3E");
    }


</style>
