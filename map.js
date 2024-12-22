var map = L.map('map').setView([53.5511, 9.9937], 12); // Startkoordinaten Hamburg

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

let markerArray = [];
let locationsData = [];


// Sidebar befüllen
function populateSidebar(locations) {
    locations.sort((a, b) => a.zip.localeCompare(b.zip));
    const listContainer = document.getElementById("locations-list");
    listContainer.innerHTML = "";

    locations.forEach((location, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${location.name}</strong><br>
            Adresse: ${location.address}<br>
            PLZ: ${location.zip}<br>
            Preisbereich: ${location.priceRange}<br>
            Spezialisierung: ${location.specialization}<br>
            <img src="${location.image}" alt="${location.name}">
        `;
        listItem.dataset.index = index;

        listItem.addEventListener("click", () => {
            map.setView(location.coords, 14);
            markerArray[index].openPopup();
        });

        listContainer.appendChild(listItem);
    });
}

// Filter anwenden
function applyFilters() {
    const price = document.getElementById("price-filter").value;
    const district = document.getElementById("district-filter").value;
    const type = document.getElementById("type-filter").value;
    const chain = document.getElementById("chain-filter").value;

    const filteredLocations = locationsData.filter(location => {
        return (
            (price === "" || location.priceRange === price) &&
            (district === "" || location.district === district) &&
            (type === "" || location.type === type) &&
            (chain === "" || location.chain === chain)
        );
    });

    updateMarkers(filteredLocations);
    populateSidebar(filteredLocations);
}

// Marker aktualisieren
function updateMarkers(locations) {
    markerArray.forEach(marker => map.removeLayer(marker));
    markerArray = [];

    locations.forEach(location => {
        const marker = L.marker(location.coords).addTo(map);
        markerArray.push(marker);
        const popupContent = `<strong>${location.name}</strong><br>${location.address}`;
        marker.bindPopup(popupContent);
    });
}

// Daten laden
fetch('locations.json')
    .then(response => response.json())
    .then(data => {
        locationsData = data;
        populateSidebar(data);
        updateMarkers(data);

        // Dynamische Filteroptionen
        populateFilterOptions(data);
    })
    .catch(error => console.error('Fehler beim Laden der Daten:', error));

// Dynamische Filteroptionen
function populateFilterOptions(data) {
    const districtSelect = document.getElementById("district-filter");
    const typeSelect = document.getElementById("type-filter");
    const chainSelect = document.getElementById("chain-filter");

    const districts = [...new Set(data.map(item => item.district))].sort();
    const types = [...new Set(data.map(item => item.type))].sort();
    const chains = [...new Set(data.map(item => item.chain))].sort();

    districts.forEach(district => {
        const option = document.createElement("option");
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
    });

    types.forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        typeSelect.appendChild(option);
    });

    chains.forEach(chain => {
        const option = document.createElement("option");
        option.value = chain;
        option.textContent = chain;
        chainSelect.appendChild(option);
    });
}
