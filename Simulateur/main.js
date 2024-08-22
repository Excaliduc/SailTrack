const fileInput = document.getElementById("fileInput");
const fileContent = document.getElementById("fileContent");
const slider = document.getElementById("sliderValue");
const numOfLine = document.getElementById("numOfLine");
const backButton = document.getElementById("backButton");
const hiddenSimulator = document.getElementById("headerHidden");
const hiddenFileSelector = document.getElementById("hiddenFileSelector");
const fileTitle = document.getElementById("fileTitle");
const fileExtensionMessage = document.getElementById("fileExtensionMessage");
const actualLine = document.getElementById("actualLine");
const btnPrevious = document.getElementById("btnPrevious");
const btnNext = document.getElementById("btnNext");
const panelHidden = document.getElementById("panelHidden");

const DELIMITER = ';';
const NEWLINE = '\n';

const allowedExtensions = ["txt","csv"];

const reader = new FileReader();

var map = L.map('map').setView([51.505, -0.09], 13);
// TODO à implementer les tamplate de map

/*var Jawg_Terrain = L.tileLayer('https://tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
	attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 22,
	accessToken: '<your accessToken>'
});
var OpenWeatherMap_Wind = L.tileLayer('http://{s}.tile.openweathermap.org/map/wind/{z}/{x}/{y}.png?appid={apiKey}', {
	maxZoom: 19,
	attribution: 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>',
	apiKey: '<insert your api key here>',
	opacity: 0.5
});*/


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);



let tabOfFileContent = [];

window.onload = function() {
    // Votre code à exécuter après le chargement de la page
    console.log("La page a été entièrement chargée !");
};

if (fileInput) {
    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0]; // TODO: implementer un système pour gérer plusieurs fichiers à la fois et créer plusieurs instances du simulateur

        if (file) {
            console.log("On est dans le if file");
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();
            console.log(fileName);
            console.log(fileExtension);
            console.log("fin du file info");

            if (allowedExtensions.includes(fileExtension)) {
                fileTitle.innerHTML = fileName;
                hiddenFileSelector.style.display = "none";
                hiddenSimulator.style.display = "block";
                panelHidden.style.display = "flex";
                fileExtensionMessage.style.display = "none";
                console.log("L'extension correspond !");
                parseCSV(file);
            } else {
                console.log("L'extension ne correspond pas !");
                fileExtensionMessage.innerHTML = "Extension de fichier non autorisée.";
                fileExtensionMessage.style.display = "block";
                fileInput.value = ""; // Réinitialise la sélection de fichier
            }
        } else {
            fileExtensionMessage.innerHTML = "Aucun fichier sélectionné.";
            fileExtensionMessage.style.display = "block";
            fileContent.textContent = ""; // Vide le contenu affiché
        }
    });
}

if (numOfLine && slider) {
    btnNext.onclick = function() {
        if (slider.value < slider.max) {
            slider.value = (Number(slider.value) + 1);
            updateSliderInfo();
        }
    };

    btnPrevious.onclick = function() {
        if (slider.value > 0) {
            slider.value = Number(slider.value) - 1;
            updateSliderInfo();
        }
    };

    slider.oninput = function() {
        updateSliderInfo();
    };
}

if (backButton) {
    backButton.onclick = function() {
        fileInput.value = "";
        hiddenFileSelector.style.display = "flex";
        hiddenSimulator.style.display = "none";
        tabOfFileContent = [];
    };
}

function parseCSV(file) {
    if (!file && !FileReader) return;

    const fr = new FileReader();

    fr.onload = function(e) {
        toTable(e.target.result);
        slider.max = tabOfFileContent.length;
        updateSliderInfo();
        const latlngs = tabOfFileContent.map(coord => [coord.latitude, coord.longitude]);
        console.log(latlngs);
        const polyline = L.polyline(latlngs, { color: 'blue' }).addTo(map);
        map.fitBounds(polyline.getBounds());
    };
    fr.readAsText(file);
}

function toTable(text) {
    if (!text) return;

    // Split the data into lines and remove any trailing newlines or carriage returns
    let lines = text.split(NEWLINE).map(line => line.trim());
    // Extract headers
    let headers = lines.shift().split(DELIMITER);

    lines.forEach(line => {
        // Split each line by the delimiter to get columns
        let columns = line.split(DELIMITER);
        // Create an object to store the current line's data
        let obj = {};
        // Map each column to the corresponding header
        headers.forEach((header, index) => {
            // Trim the value to remove any unwanted characters like '\r'
            obj[header] = columns[index];
        });
        // Add the object to the result array
        tabOfFileContent.push(obj);
    });
    console.log(tabOfFileContent);
}


function updateSliderInfo() {
    numOfLine.innerHTML = slider.value + '/' + slider.max;
    if (tabOfFileContent && tabOfFileContent[slider.value - 1]) {
        actualLine.innerHTML = tabOfFileContent[slider.value - 1].direction;
        if(typeof marker == 'undefined')
        {
            marker = L.marker([tabOfFileContent[slider.value - 1].latitude, tabOfFileContent[slider.value - 1].longitude]).addTo(map);
            // Ajuste la vue sur le point 
            // map.setView([tabOfFileContent[slider.value - 1].latitude, tabOfFileContent[slider.value - 1].longitude], 12); 
        } 
        else
        {
            marker.remove();
            marker = L.marker([tabOfFileContent[slider.value - 1].latitude, tabOfFileContent[slider.value - 1].longitude]).addTo(map);
            // Ajuste la vue sur le point 
            // map.setView([tabOfFileContent[slider.value - 1].latitude, tabOfFileContent[slider.value - 1].longitude], 12);
        }
    }
}

function path() {
    
}
