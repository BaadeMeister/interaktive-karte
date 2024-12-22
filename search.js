// Suchfunktion
function searchLocation() {
    var query = document.getElementById('search').value;

    // Geokodierungs-API verwenden, um Koordinaten zu erhalten
    var geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                var location = data[0];
                var lat = parseFloat(location.lat);
                var lon = parseFloat(location.lon);

                // Karte nur zentrieren, ohne zusätzlichen Marker
                map.setView([lat, lon], 14);

                // Optional: Popup entfernen, falls es aktiv war
                if (map.hasLayer(L.popup())) {
                    map.closePopup();
                }
            } else {
                alert("Ort nicht gefunden. Bitte einen gültigen Ort eingeben.");
            }
        })
        .catch(error => console.error('Fehler bei der Geokodierung:', error));
}

// Event-Listener für Enter-Taste hinzufügen
document.getElementById('search').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Verhindert das Standard-Formular-Verhalten
        searchLocation(); // Ruft die Suchfunktion auf
    }
});
