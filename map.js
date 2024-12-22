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

// Marker-Icons
const defaultIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

const highlightedIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

// Hervorhebungen verwalten
let activeMarker = null;

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
            highlightListItem(listItem);

            // Marker hervorheben
            if (activeMarker) {
                activeMarker.setIcon(defaultIcon);
            }
            const marker = markerArray[index];
            marker.setIcon(highlightedIcon);
            activeMarker = marker;
        });

        listContainer.appendChild(listItem);
    });
}

// Marker aktualisieren
function updateMarkers(locations) {
    markerArray.forEach(marker => map.removeLayer(marker));
    markerArray = [];

    locations.forEach((location, index) => {
        const marker = L.marker(location.coords, { icon: defaultIcon }).addTo(map);
        markerArray.push(marker);

        marker.on("click", () => {
            highlightListItem(document.querySelector(`[data-index="${index}"]`));

            if (activeMarker) {
                activeMarker.setIcon(defaultIcon); // Vorherigen Marker zurücksetzen
            }
            marker.setIcon(highlightedIcon); // Neuen Marker hervorheben
            activeMarker = marker;

            if (window.innerWidth <= 600) {
                showMobileInfo(location);
            } else {
                L.popup({
                    offset: L.point(0, -20) // Popup leicht über dem Marker anzeigen
                })
                    .setLatLng(location.coords)
                    .setContent(`
                        <div class="popup-content">
                            <img src="${location.image}" alt="${location.name}">
                            <strong>${location.name}</strong><br>
                            Preis: ${location.priceRange}
                        </div>
                    `)
                    .openOn(map);
            }
        });
    });
}

// Eintrag in der Liste hervorheben
function highlightListItem(listItem) {
    document.querySelectorAll("#locations-list li").forEach(item => {
        item.classList.remove("highlighted");
    });
    if (listItem) {
        listItem.classList.add("highlighted");
        listItem.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

// Mobile Info anzeigen
function showMobileInfo(location) {
    const mobileInfo = document.querySelector("#mobile-info");
    mobileInfo.innerHTML = `
        <img src="${location.image}" alt="${location.name}">
        <div>
            <strong>${location.name}</strong><br>
            ${location.address}<br>
            Preis: ${location.priceRange}
        </div>
    `;
    mobileInfo.classList.add("active");
}

// Mobile Info ausblenden
function hideMobileInfo() {
    const mobileInfo = document.querySelector("#mobile-info");
    mobileInfo.classList.remove("active");
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
