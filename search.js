// Suchfunktion
function searchLocation() {
    const query = document.getElementById('search').value.trim();

    if (query === "") {
        alert("Bitte gib einen gültigen Ort oder Stadtteil ein.");
        return;
    }

    // 1. Priorität: Suche innerhalb von Hamburg
    const hamburgGeocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&viewbox=9.7185,53.9640,10.3295,53.3950&bounded=1`;

    fetch(hamburgGeocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                // Treffer innerhalb von Hamburg gefunden
                const location = data[0];
                const lat = parseFloat(location.lat);
                const lon = parseFloat(location.lon);

                // Karte zentrieren
                map.setView([lat, lon], 14);
            } else {
                // Keine Treffer in Hamburg -> Suche in Deutschland
                searchInGermany(query);
            }
        })
        .catch(error => console.error('Fehler bei der Geokodierung für Hamburg:', error));
}

// 2. Priorität: Suche innerhalb von Deutschland
function searchInGermany(query) {
    const germanyGeocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&bounded=1`;

    fetch(germanyGeocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                // Treffer innerhalb von Deutschland gefunden
                const location = data[0];
                const lat = parseFloat(location.lat);
                const lon = parseFloat(location.lon);

                // Karte zentrieren
                map.setView([lat, lon], 14);
            } else {
                alert("Ort nicht gefunden. Bitte einen gültigen Ort eingeben.");
            }
        })
        .catch(error => console.error('Fehler bei der Geokodierung für Deutschland:', error));
}

// Event-Listener für Enter-Taste hinzufügen
document.getElementById('search').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Verhindert das Standardverhalten
        searchLocation(); // Ruft die Suchfunktion auf
    }
});

// Zusätzlicher Hinweis bei fehlgeschlagenen Suchanfragen
function showNoResultsMessage(query) {
    alert(`Keine Ergebnisse für '${query}' gefunden. Bitte überprüfe deine Eingabe.`);
}
