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
            <div class="list-item">
                <img src="${location.image}" alt="${location.name}" class="list-item-image">
                <div class="list-item-details">
                    <strong>${location.name}</strong><br>
                    ${location.address.split(',')[0]}<br>
                    Preisbereich: ${location.priceRange}
                </div>
            </div>
        `;
        listItem.dataset.index = index;

        // Klick-Event für die Liste
        listItem.addEventListener("click", () => {
            map.setView(location.coords, 14); // Karte zentrieren
            markerArray[index].openPopup(); // Popup öffnen
            highlightListItem(listItem);
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
        const popupContent = `
            <div class="popup-content">
                <img src="${location.image}" alt="${location.name}" class="popup-image">
                <strong>${location.name}</strong><br>
                Preisbereich: ${location.priceRange}<br>
                <a href="${location.link}" class="popup-link">Mehr Details</a>
            </div>
        `;
        marker.bindPopup(popupContent);

        // Event für Marker-Klick
        marker.on('click', () => {
            const listItem = document.querySelector(`[data-index="${locations.indexOf(location)}"]`);
            highlightListItem(listItem);
        });
    });
}

// Listelement hervorheben
function highlightListItem(listItem) {
    const allItems = document.querySelectorAll("#locations-list li");
    allItems.forEach(item => item.classList.remove("highlighted"));
    listItem.classList.add("highlighted");

    // Scrollen, um das Element zu zentrieren
    listItem.scrollIntoView({ behavior: "smooth", block: "center" });
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
