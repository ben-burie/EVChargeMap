const map = L.map('map').setView([39.8283, -98.5795], 4);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

let routeControl;

// Function to geocode location name to coordinates
async function geocodeLocation(location) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
        );
        const data = await response.json();

        if (data.length === 0) {
            return null;
        }

        const result = data[0];
        return {
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
            name: result.name
        };
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

// Function to search route and display on map
async function searchRoute(event) {
    event.preventDefault();

    const startLocationInput = document.getElementById('start-location').value.trim();
    const endLocationInput = document.getElementById('end-location').value.trim();
    const messageDiv = document.getElementById('message');

    messageDiv.innerHTML = '';

    if (!startLocationInput || !endLocationInput) {
        messageDiv.innerHTML = '<div class="message error">Please enter both start and end locations</div>';
        return;
    }

    messageDiv.innerHTML = '<div class="message success">Searching...</div>';

    // Geocode both locations
    const startLocation = await geocodeLocation(startLocationInput);
    const endLocation = await geocodeLocation(endLocationInput);

    if (!startLocation) {
        messageDiv.innerHTML = '<div class="message error">Start location not found</div>';
        return;
    }

    if (!endLocation) {
        messageDiv.innerHTML = '<div class="message error">End location not found</div>';
        return;
    }

    // Remove existing route if any
    if (routeControl) {
        map.removeControl(routeControl);
    }

    // Create routing control with hidden panel
    routeControl = L.Routing.control({
        waypoints: [
            L.latLng(startLocation.lat, startLocation.lng),
            L.latLng(endLocation.lat, endLocation.lng)
        ],
        routeWhileDragging: false,
        show: false,
        addWaypoints: false,
        lineOptions: {
            styles: [{ color: 'blue', opacity: 0.6, weight: 4 }]
        },
        createMarker: function(i, wp, nWps) {
            let markerColor = i === 0 ? 'green' : i === nWps - 1 ? 'red' : 'blue';
            return L.marker(wp.latLng, {
                radius: 10,
                fillColor: markerColor,
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(i === 0 ? `Start: ${startLocation.name}` : `End: ${endLocation.name}`);
        }
    }).addTo(map);

    // Fit map to show entire route
    const bounds = L.latLngBounds(
        [startLocation.lat, startLocation.lng],
        [endLocation.lat, endLocation.lng]
    );
    map.fitBounds(bounds, { padding: [50, 50] });

    messageDiv.innerHTML = '<div class="message success">Route displayed!</div>';
}

// Allow Enter key to trigger search
document.getElementById('end-location').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchRoute(event);
    }
});