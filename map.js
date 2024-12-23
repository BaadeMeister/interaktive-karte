// Karte initialisieren
const map = L.map('map', { zoomControl: true }).setView([53.5511, 9.9937], 12);

// OpenStreetMap-Tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

// Variablen für Marker und Standortdaten
let markerArray = [];
let activeMarker = null;

// Marker-Icons
const defaultIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const highlightedIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Sidebar und Marker-Management
function populateSidebar(locations) {
    const listContainer = document.getElementById("locations-list");
    listContainer.innerHTML = ""; // Alte Inhalte löschen

    locations.forEach((location, index) => {
        const listItem = document.createElement("li");
        listItem.classList.add("location-item");
        listItem.innerHTML = `
            <img src="${location.image}" alt="${location.name}" />
            <div>
                <strong>${location.name}</strong><br />
                ${location.address.split(',')[0]}<br />
            </div>
        `;
        listItem.dataset.index = index;

        listItem.addEventListener("click", () => {
            map.setView(location.coords, 14);
            highlightMarker(markerArray[index]);
        });

        listContainer.appendChild(listItem);
    });
}

function updateMarkers(locations) {
    markerArray.forEach(marker => map.removeLayer(marker));
    markerArray = [];

    locations.forEach((location, index) => {
        const marker = L.marker(location.coords, { icon: defaultIcon }).addTo(map);
        markerArray.push(marker);

        marker.on("click", () => {
            highlightMarker(marker);
        });
    });
}

function highlightMarker(marker) {
    if (activeMarker) {
        activeMarker.setIcon(defaultIcon);
    }
    marker.setIcon(highlightedIcon);
    activeMarker = marker;
}

// Daten laden
fetch("locations.json")
    .then(response => response.json())
    .then(data => {
        populateSidebar(data);
        updateMarkers(data);
    })
    .catch(err => console.error("Fehler beim Laden der Daten:", err));
