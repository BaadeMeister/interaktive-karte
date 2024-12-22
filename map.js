// Karte initialisieren mit Startpunkt Hamburg
var map = L.map('map').setView([53.5511, 9.9937], 12); // Koordinaten für Hamburg

// OpenStreetMap-Tiles laden
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// Marker-Array zur Speicherung aller Marker
let markerArray = [];
let locationsData = []; // Variable für die geladenen Locations

// Funktion: Liste erstellen und sortieren
function populateSidebar(locations) {
    // Sortiere nach PLZ
    locations.sort((a, b) => a.zip.localeCompare(b.zip));

    var listContainer = document.getElementById("locations-list");
    listContainer.innerHTML = ""; // Alte Inhalte löschen

    locations.forEach((location, index) => {
        var listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${location.name}</strong><br>
            Adresse: ${location.address}<br>
            PLZ: ${location.zip}<br>
            Preisbereich: ${location.priceRange}<br>
            Spezialisierung: ${location.specialization}<br>
            <img src="${location.image}" alt="${location.name}">
        `;
        listItem.dataset.index = index;

        // Klick-Event für das Listenelement
        listItem.addEventListener("click", () => {
            map.setView(location.coords, 14); // Karte zentrieren
            markerArray[index].openPopup(); // Popup öffnen
        });

        listContainer.appendChild(listItem);
    });
}

// Funktion: Filter anwenden
function applyFilters() {
    // Filterwerte abrufen
    const priceFilter = document.getElementById("price-filter").value;
    const districtFilter = document.getElementById("district-filter").value;
    const typeFilter = document.getElementById("type-filter").value;
    const chainFilter = document.getElementById("chain-filter").value;

    // Gefilterte Daten erstellen
    const filteredLocations = locationsData.filter(location => {
        return (
            (priceFilter === "" || location.priceRange === priceFilter) &&
            (districtFilter === "" || location.district === districtFilter) &&
            (typeFilter === "" || location.type === typeFilter) &&
            (chainFilter === "" || location.chain === chainFilter)
        );
    });

    // Liste und Marker aktualisieren
    updateMarkers(filteredLocations);
    populateSidebar(filteredLocations);
}

// Funktion: Marker basierend auf gefilterten Daten aktualisieren
function updateMarkers(locations) {
    // Alle bestehenden Marker von der Karte entfernen
    markerArray.forEach(marker => map.removeLayer(marker));
    markerArray = []; // Marker-Array leeren

    // Neue Marker basierend auf gefilterten Daten hinzufügen
    locations.forEach((location, index) => {
        var marker = L.marker(location.coords).addTo(map);
        markerArray.push(marker); // Marker speichern

        // Popup-Inhalt
        var popupContent = `
            <strong>${location.name}</strong><br>
            Preisbereich: ${location.priceRange}<br>
            Spezialisierung: ${location.specialization}
        `;
        marker.bindPopup(popupContent);
    });
}

// Daten laden und Marker hinzufügen
fetch('locations.json')
    .then(response => response.json())
    .then(data => {
        locationsData = data; // Daten speichern
        populateSidebar(data);
        updateMarkers(data);
    })
    .catch(error => console.error('Fehler beim Laden der Daten:', error));
