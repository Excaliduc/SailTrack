export function coucou()
{
    console.log("hello")
}


function parseCSV(file: File) {
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

function toTable(text: string) {
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
