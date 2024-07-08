// const { constants } = require('buffer');

const fileInput = document.getElementById("fileInput");
const fileContent = document.getElementById("fileContent");
const slider = document.getElementById("sliderValue");
const timeInfo = document.getElementById("timeInfo");
const backButton = document.getElementById("backButton");
const hiddenSimulator = document.getElementById("headerHidden");
const hiddenFileSelector = document.getElementById("hiddenFileSelector");
const fileTitle = document.getElementById("fileTitle");
const fileExtensionMessage = document.getElementById("fileExtensionMessage");

const allowedExtensions = ['txt'];

const reader = new FileReader();

window.onload = function() {
    // Votre code à exécuter après le chargement de la page
    console.log("La page a été entièrement chargée !");
};

if(fileInput)
{
    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0]; // TODO implementer un systeme de pour gérer plusieru fichier a la fois et créer plusieur instance du simulateur
        const reader = new FileReader();

        if(file)
        {
            console.log("On est dans le if file");
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();
            console.log("debut file info :");
            console.log(fileName);
            console.log(fileExtension);
            console.log("fin du file info");
            // fileContent.textContent = event.target.result;
            
            if (allowedExtensions.includes(fileExtension)) 
            {
                fileTitle.innerHTML = fileName;
                hiddenFileSelector.style.display = "none"; 
                hiddenSimulator.style.display = "block";

                fileExtensionMessage.style.display = "none";
                console.log("L'extention correspond !");
                //////////////////////////////////////////////////
                
                // reader.onload = function (event) {
                //     var arrayBuffer = event.target.result;
                //     var array = new Uint8Array(arrayBuffer);

                //     // Display some information about the file
                //     var fileSize = arrayBuffer.byteLength;
                //     var bytes = [];
                //     for (var i = 0; i < Math.min(20, fileSize); i++) {
                //         bytes.push(array[i]);
                //     }

                //     document
                //         .getElementById('fileContents')
                //         .textContent = 'First 20 bytes of file as ArrayBuffer: ' + bytes.join(', ');
                //     console.log('ArrayBuffer:', arrayBuffer);
                // };

                // reader.readAsArrayBuffer(file);
                console.log("debut de la lecture du fichier test yt");
                const actualLine = document.getElementById("actualLine");
                const fr = new FileReader();
                fr.readAsArrayBuffer(file);
                
                fr.onload  = function(){
                    console.log(fr.result);
                    actualLine.innerHTML = fr.result;
                };
                console.log("fin de la lecture du fichier");
            } 
            
            
            
            else {
                console.log("L'extention ne correspond pas !");
                fileExtensionMessage.innerHTML = "Extension de fichier non autorisée.";
                fileExtensionMessage.style.display = "block";
                fileInput.value = ""; // Réinitialise la sélection de fichier
            } 
        }
        else 
        {
            fileExtensionMessage.innerHTML = "Aucun fichier sélectionné.";
            fileExtensionMessage.style.display = "block";
            fileContent.textContent = ""; // Vide le contenu affiché
        }
    });

}

if (timeInfo && slider)
{
    timeInfo.innerHTML = slider.value;
    slider.oninput = function() {
        timeInfo.innerHTML = this.value;
    }
}

if(backButton)
{
    backButton.onclick = function() {
        fileInput.value = "";
        hiddenFileSelector.style.display = "flex"; 
        hiddenSimulator.style.display = "none";
    }
}

function read(file)
{
    const fs = require('fs')
    fs.readFile(file, (err, inputD) => {
    if (err) throw err;
        console.log(inputD.toString());
    })
}
