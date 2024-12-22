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

// Daten laden und Marker sowie Sidebar initialisieren
fetch('locations.json')
    .then(response => response.json())
    .then(data => {
        locationsData = data; // Standortdaten speichern
        populateSidebar(data); // Sidebar befüllen
        updateMarkers(data); // Marker hinzufügen
    })
    .catch(error => console.error('Fehler beim Laden der Daten:', error));

// Dynamische Filteroptionen deaktiviert (falls benötigt, einfach aktivieren)
// function populateFilterOptions(data) { ... }
