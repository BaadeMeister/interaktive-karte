// Karte initialisieren
var map = L.map('map').setView([53.5511, 9.9937], 12);

// OpenStreetMap-Tiles
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// Variablen für Marker und Standortdaten
let markerArray = [];
let locationsData = [];

// Sidebar aktualisieren
function populateSidebar(locations) {
    const listContainer = document.getElementById("locations-list");
    listContainer.innerHTML = ""; // Alte Inhalte löschen

    locations.forEach((location, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <img src="${location.image}" alt="${location.name}">
            <div>
                <strong>${location.name}</strong><br>
                ${location.address.split(',')[0]}<br>
                Preis: ${location.priceRange}
            </div>
        `;
        listItem.dataset.index = index;

        listItem.addEventListener("click", () => {
            map.setView(location.coords, 14);
            markerArray[index].openPopup();
            highlightListItem(listItem);
        });

        listContainer.appendChild(listItem);
    });
}

// Marker aktualisieren
function updateMarkers(locations) {
    markerArray.forEach(marker => map.removeLayer(marker));
    markerArray = [];

    locations.forEach((location, index) => {
        const marker = L.marker(location.coords).addTo(map);
        markerArray.push(marker);

        marker.on("click", () => {
            updateMobileInfo(location);
        });
    });
}

// Mobilinfo aktualisieren
function updateMobileInfo(location) {
    const mobileInfo = document.getElementById("mobile-info");
    const mobileInfoContent = document.getElementById("mobile-info-content");

    mobileInfoContent.innerHTML = `
        <img src="${location.image}" alt="${location.name}">
        <div>
            <strong>${location.name}</strong><br>
            ${location.address.split(',')[0]}<br>
            Preis: ${location.priceRange}
        </div>
    `;
    mobileInfo.classList.remove("hidden");
}

// Daten laden
fetch("locations.json")
    .then(response => response.json())
    .then(data => {
        locationsData = data;
        populateSidebar(data);
        updateMarkers(data);
    })
    .catch(error => console.error("Fehler:", error));
