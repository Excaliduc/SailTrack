import * as THREE from 'three';

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
const mapDirId = document.getElementById("map");
const giteSimulateur = document.getElementById('giteSimulateur');

const DELIMITER = ';';
const NEWLINE = '\n';

const allowedExtensions = ["txt","csv"];

// Création de la scène et de la caméra
const threeScene = new THREE.Scene();
const threeCamera = new THREE.PerspectiveCamera(75, giteSimulateur.clientWidth / giteSimulateur.clientHeight, 0.1, 1000);
// Création du renderer
const threeRenderer = new THREE.WebGLRenderer();


// Création d'un cube
const threeGeometry = new THREE.BoxGeometry(1, 1, 1);
const threeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const threeCube = new THREE.Mesh(threeGeometry, threeMaterial);

let marker;
var map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let tabOfFileContent = [];

window.onload = function() {
    console.log("La page a été entièrement chargée !");
    animate();  // Assurez-vous que l'animation commence après le chargement de la page
};

if (fileInput) {
    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];

        if (file) {
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();

            if (allowedExtensions.includes(fileExtension)) {
                fileTitle.innerHTML = fileName;
                hiddenFileSelector.style.display = "none";
                hiddenSimulator.style.display = "block";
                panelHidden.style.display = "flex";
                fileExtensionMessage.style.display = "none";
                setTimeout(() => {
                    map.invalidateSize();
                }, 100);

                threeRenderer.setSize(giteSimulateur.clientWidth, giteSimulateur.clientHeight);
                giteSimulateur.appendChild(threeRenderer.domElement);
                threeScene.add(threeCube);
                updateRenderer();
                parseCSV(file);
            } else {
                fileExtensionMessage.innerHTML = "Extension de fichier non autorisée.";
                fileExtensionMessage.style.display = "block";
                fileInput.value = "";
            }
        } else {
            fileExtensionMessage.innerHTML = "Aucun fichier sélectionné.";
            fileExtensionMessage.style.display = "block";
            fileContent.textContent = "";
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
        panelHidden.style.display = "none";
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

        setTimeout(() => {
            const latlngs = tabOfFileContent.map(coord => [coord.latitude, coord.longitude]);
            const polyline = L.polyline(latlngs, { color: 'blue' }).addTo(map);
            map.fitBounds(polyline.getBounds());
        }, 100);
    };
    fr.readAsText(file);
}

function toTable(text) {
    if (!text) return;

    let lines = text.split(NEWLINE).map(line => line.trim());
    let headers = lines.shift().split(DELIMITER);

    lines.forEach(line => {
        let columns = line.split(DELIMITER);
        let obj = {};
        headers.forEach((header, index) => {
            obj[header] = columns[index];
        });
        tabOfFileContent.push(obj);
    });
    console.log(tabOfFileContent);
}

function updateSliderInfo() {
    numOfLine.innerHTML = slider.value + '/' + slider.max;
    if (tabOfFileContent && tabOfFileContent[slider.value - 1]) {
        actualLine.innerHTML = tabOfFileContent[slider.value - 1].direction;
        if (typeof marker == 'undefined') {
            marker = L.marker([tabOfFileContent[slider.value - 1].latitude, tabOfFileContent[slider.value - 1].longitude]).addTo(map);
        } else {
            marker.remove();
            marker = L.marker([tabOfFileContent[slider.value - 1].latitude, tabOfFileContent[slider.value - 1].longitude]).addTo(map);
        }
    }
}

// Fonction d'animation continue
function animate() {
    requestAnimationFrame(animate);
    threeCube.rotation.x += 0.01;
    threeCube.rotation.y += 0.01;
    threeRenderer.render(threeScene, threeCamera);
}

// Mise à jour de la taille du renderer et de la caméra
function updateRenderer() {
    const width = giteSimulateur.clientWidth;
    const height = giteSimulateur.clientHeight;
    if (width > 0 && height > 0) {
        threeRenderer.setSize(width, height);
        threeCamera.aspect = width / height;
        threeCamera.updateProjectionMatrix();
    }
}

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', updateRenderer);
