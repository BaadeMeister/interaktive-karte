// Karte initialisieren mit Startkoordinaten für Hamburg
var map = L.map('map').setView([53.5511, 9.9937], 12);

// OpenStreetMap-Tiles laden
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// Variablen für Marker und Standortdaten
let markerArray = [];
let locationsData = [];

// Koordinaten für bekannte Stadtteile/Orte
const locationCoordinates = {
    "harburg": [53.4606, 9.9834],
    "altona": [53.5542, 9.9356],
    "eimsbüttel": [53.5734, 9.9512],
    "altstadt": [53.5494, 9.9933],
    "st. pauli": [53.5508, 9.9630]
};

// Sidebar befüllen (sortiert nach PLZ)
function populateSidebar(locations) {
    locations.sort((a, b) => a.zip.localeCompare(b.zip));
    const listContainer = document.getElementById("locations-list");
    listContainer.innerHTML = ""; // Alte Inhalte löschen

    locations.forEach((location, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${location.name}</strong><br>
            Adresse: ${location.address}<br>
            PLZ: ${location.zip}<br>
            Preisbereich: ${location.priceRange}<br>
            Spezialisierung: ${location.specialization}<br>
            <img src="${location.image}" alt="${location.name}">
        `;
        listItem.dataset.index = index;

        // Klick-Event für die Liste
        listItem.addEventListener("click", () => {
            map.setView(location.coords, 14); // Karte zentrieren
            markerArray[index].openPopup(); // Popup öffnen
        });

        listContainer.appendChild(listItem);
    });
}

// Marker aktualisieren basierend auf den Standortdaten
function updateMarkers(locations) {
    // Alte Marker von der Karte entfernen
    markerArray.forEach(marker => map.removeLayer(marker));
    markerArray = []; // Marker-Array zurücksetzen

    // Neue Marker hinzufügen
    locations.forEach(location => {
        const marker = L.marker(location.coords).addTo(map);
        markerArray.push(marker);

        // Popup-Inhalt definieren
        const popupContent = `<strong>${location.name}</strong><br>${location.address}`;
        marker.bindPopup(popupContent);
    });
}

// Funktion für die Suchleiste
function searchLocation() {
    const query = document.getElementById('search').value.trim().toLowerCase();
    
    if (query === "") {
        alert("Bitte gib einen gültigen Ort oder Stadtteil ein.");
        return;
    }

    if (locationCoordinates[query]) {
        map.setView(locationCoordinates[query], 14); // Karte auf den Ort zentrieren
    } else {
        alert(`Kein passender Ort für '${query}' gefunden.`);
    }
}

// Daten laden und Marker sowie Sidebar initialisieren
fetch('locations.json')
    .then(response => response.json())
    .then(data => {
        locationsData = data; // Standortdaten speichern
        populateSidebar(data); // Sidebar befüllen
        updateMarkers(data); // Marker hinzufügen
    })
    .catch(error => console.error('Fehler beim Laden der Daten:', error));
