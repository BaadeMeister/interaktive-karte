// Suchfunktion
function searchLocation() {
    var query = document.getElementById('search').value;

    // 1. Priorität: Suche innerhalb von Hamburg
    var hamburgGeocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&viewbox=9.7185,53.9640,10.3295,53.3950&bounded=1`;

    fetch(hamburgGeocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                // Treffer innerhalb von Hamburg gefunden
                var location = data[0];
                var lat = parseFloat(location.lat);
                var lon = parseFloat(location.lon);

                // Karte zentrieren
                map.setView([lat, lon], 14);

                // Optional: Popup anzeigen
                L.popup()
                    .setLatLng([lat, lon])
                    .setContent(`<b>${location.display_name}</b>`)
                    .openOn(map);
            } else {
                // Keine Treffer in Hamburg -> Suche in Deutschland
                searchInGermany(query);
            }
        })
        .catch(error => console.error('Fehler bei der Geokodierung für Hamburg:', error));
}

// 2. Priorität: Suche innerhalb von Deutschland
function searchInGermany(query) {
    var germanyGeocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&viewbox=5.8652,55.0992,15.0419,47.2701&bounded=1`;

    fetch(germanyGeocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                // Treffer innerhalb von Deutschland gefunden
                var location = data[0];
                var lat = parseFloat(location.lat);
                var lon = parseFloat(location.lon);

                // Karte zentrieren
                map.setView([lat, lon], 14);

                // Optional: Popup anzeigen
                L.popup()
                    .setLatLng([lat, lon])
                    .setContent(`<b>${location.display_name}</b>`)
                    .openOn(map);
            } else {
                alert("Ort nicht gefunden. Bitte einen gültigen Ort eingeben.");
            }
        })
        .catch(error => console.error('Fehler bei der Geokodierung für Deutschland:', error));
}

// Event-Listener für Enter-Taste hinzufügen
document.getElementById('search').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Verhindert das Standard-Formular-Verhalten
        searchLocation(); // Ruft die Suchfunktion auf
    }
});
