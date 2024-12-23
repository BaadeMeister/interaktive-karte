// Karte initialisieren
var map = L.map('map', { zoomControl: false }).setView([53.5511, 9.9937], 12);

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
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

const highlightedIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
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
        listItem.classList.add("location-item"); // Klasse für Styling
        listItem.innerHTML = `
            <img src="${location.image}" alt="${location.name}">
            <div>
                <strong>${location.name}</strong><br>
                ${location.address.split(',')[0]}<br>
                <div class="price-and-tags">
                    <span class="price">${location.priceRange}</span>
                    <div class="tags">
                        ${location.tags ? location.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ') : ''}
                    </div>
                </div>
            </div>
        `;
        listItem.dataset.index = index;

        listItem.addEventListener("click", () => {
            map.setView(location.coords, 14);
            highlightListItem(listItem);
            highlightMarker(markerArray[index]);
            if (window.innerWidth <= 700) showMobileInfo(location);
        });

        listContainer.appendChild(listItem);
    });
}

// Marker hervorheben
function highlightMarker(marker) {
    if (activeMarker) {
        activeMarker.setIcon(defaultIcon);
    }
    marker.setIcon(highlightedIcon);
    activeMarker = marker;
}

// Mobile Info anzeigen
function showMobileInfo(location = null) {
    const mobileInfo = document.querySelector("#mobile-info");
    if (location) {
        mobileInfo.innerHTML = `
            <img src="${location.image}" alt="${location.name}">
            <div>
                <strong>${location.name}</strong><br>
                ${location.address.split(',')[0]}<br>
                <div class="price-and-tags">
                    <span class="price">${location.priceRange}</span>
                    <div class="tags">
                        ${location.tags ? location.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ') : ''}
                    </div>
                </div>
            </div>
        `;
    } else {
        mobileInfo.innerHTML = `
            <div style="text-align: center; padding: 10px;">
                <strong>Wähle einen Marker auf der Karte aus, um Details zu sehen.</strong>
            </div>
        `;
    }
    mobileInfo.classList.add("active");
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
            highlightMarker(marker);
            if (window.innerWidth <= 700) showMobileInfo(location);
        });
    });
}

// Eintrag in der Liste hervorheben
function highlightListItem(listItem) {
    document.querySelectorAll("#locations-list li").forEach(item => item.classList.remove("highlighted"));
    if (listItem) {
        listItem.classList.add("highlighted");
        listItem.scrollIntoView({ behavior: "smooth", block: "center" });
    }
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
        showMobileInfo(); // Standardnachricht anzeigen
    })
    .catch(error => console.error("Fehler:", error));

// Fenstergrößenänderung überwachen
window.addEventListener('resize', () => {
    const mobileInfo = document.querySelector("#mobile-info");
    if (window.innerWidth > 700) {
        // Schließe die mobile Info, wenn die Breite > 700px ist
        mobileInfo.classList.remove("active");
    }
});

