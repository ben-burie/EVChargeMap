const map = L.map('map').setView([39.8283, -98.5795], 4);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

let routeControl;
let intermediateMarkers = [];
const FLASK_API_URL = 'http://localhost:5000/api/calculate-stations';

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

// Function to fetch intermediate stops from Flask
async function fetchIntermediateStops(startLat, startLng, endLat, endLng) {
    try {
        const response = await fetch(FLASK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                start_lat: startLat,
                start_lng: startLng,
                end_lat: endLat,
                end_lng: endLng,
            })
        });

        const data = await response.json();
        
        if (!data.success) {
            console.error('Error from Flask:', data.error);
            return [];
        }

        return data.stops;
    } catch (error) {
        console.error('Error fetching stops:', error);
        return [];
    }
}

// Function to clear intermediate markers
function clearIntermediateMarkers() {
    intermediateMarkers.forEach(marker => map.removeLayer(marker));
    intermediateMarkers = [];
}

// Function to plot intermediate stops on map
function plotIntermediateStops(stops) {
    clearIntermediateMarkers();

    stops.forEach((stop, index) => {
        let marker;
        
        if (stop.type === 'checkpoint') {
            // Checkpoints as light blue circles
            marker = L.circleMarker([stop.lat, stop.lng], {
                radius: 7,
                fillColor: '#60a5fa',
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.7
            }).bindPopup(`${stop.name}`);
        } 
        else if (stop.type === 'station') {
            // Stations as yellow/orange circles (larger)
            marker = L.circleMarker([stop.lat, stop.lng], {
                radius: 9,
                fillColor: '#fbbf24',
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.9
            }).bindPopup(`${stop.name}<br>City: ${stop.city}, ${stop.state}`);
        }

        if (marker) {
            marker.addTo(map);
            intermediateMarkers.push(marker);
        }
    });
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

    // Clear existing intermediate markers
    clearIntermediateMarkers();

    // Fetch intermediate stops from Flask
    const stops = await fetchIntermediateStops(
        startLocation.lat,
        startLocation.lng,
        endLocation.lat,
        endLocation.lng,
        5 // Number of intermediate points
    );

    // Plot intermediate stops
    if (stops.length > 0) {
        plotIntermediateStops(stops);
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
            let markerColor = i === 0 ? '#22c55e' : i === nWps - 1 ? '#ef4444' : '#3b82f6';
            return L.circleMarker(wp.latLng, {
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

    messageDiv.innerHTML = '<div class="message success">Route displayed with stops!</div>';
}

// Allow Enter key to trigger search
document.getElementById('end-location').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchRoute(event);
    }
});