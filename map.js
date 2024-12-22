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

// Funktion zum Anzeigen der Kurzinfo
function showMarkerInfo(location) {
    const infoBox = document.getElementById("marker-info");
    const infoImage = document.getElementById("marker-info-image");
    const infoName = document.getElementById("marker-info-name");
    const infoAddress = document.getElementById("marker-info-address");
    const infoPrice = document.getElementById("marker-info-price");

    // Daten aus dem Marker setzen
    infoImage.src = location.image;
    infoName.textContent = location.name;
    infoAddress.textContent = location.address.split(',')[0];
    infoPrice.textContent = `Preis: ${location.priceRange}`;

    // Box anzeigen
    infoBox.classList.remove("hidden");
}

// Marker aktualisieren
function updateMarkers(locations) {
    markerArray.forEach(marker => map.removeLayer(marker));
    markerArray = [];

    locations.forEach((location, index) => {
        const marker = L.marker(location.coords).addTo(map);
        markerArray.push(marker);

        // Event für Marker-Klick
        marker.on("click", () => {
            if (window.innerWidth <= 600) {
                // Mobilansicht: Kurzinfo anzeigen
                showMarkerInfo(location);
            } else {
                // Desktop: Klassisches Popup
                const popupContent = `
                    <div>
                        <img src="${location.image}" alt="${location.name}">
                        <strong>${location.name}</strong><br>
                        Preis: ${location.priceRange}
                    </div>
                `;
                marker.bindPopup(popupContent).openPopup();
            }
        });
    });
}

// Sidebar befüllen
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
        });

        listContainer.appendChild(listItem);
    });
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
