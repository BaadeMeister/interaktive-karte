// Karte initialisieren mit Startpunkt Hamburg
var map = L.map('map').setView([53.5511, 9.9937], 12); // Koordinaten für Hamburg

// OpenStreetMap-Tiles laden
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

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
            map.setVi
