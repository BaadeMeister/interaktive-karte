// Karte initialisieren mit Startpunkt Hamburg
var map = L.map('map').setView([53.5511, 9.9937], 12); // Koordinaten für Hamburg

// OpenStreetMap-Tiles laden
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// JSON-Daten laden und Marker hinzufügen
fetch('locations.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(location => {
            // Popup-Inhalt mit erweiterten Informationen
            var popupContent = `
                <div class="popup-content">
                    <img src="${location.image}" alt="${location.name}">
                    <strong>${location.name}</strong><br>
                    Preisbereich: ${location.priceRange}<br>
                    Spezialisierung: ${location.specialization}
                </div>
            `;
            L.marker(location.coords).addTo(map).bindPopup(popupContent);
        });
    })
    .catch(error => console.error('Fehler beim Laden der Daten:', error));
