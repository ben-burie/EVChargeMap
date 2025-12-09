const map = L.map('map').setView([39.8283, -98.5795], 4);
let allStops = []; 

const user = JSON.parse(sessionStorage.getItem('user'));

if (!user) {
    alert('You must be logged in');
    window.location.href = '/logon.html';
}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

let routeControl;
let intermediateMarkers = [];
let routeCoordinates = [];

const STATION_ENDPOINT_URL = 'http://localhost:5000/api/calculate-stations';
const CAR_ENDPOINT_URL = 'http://localhost:5000/api/get-user-cars';
const TRIP_ENDPOINT_URL = 'http://localhost:5000/api/create-trip';

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

function extractRouteCoordinates(routeControl) {
    routeCoordinates = [];
    
    if (!routeControl || !routeControl.getWaypoints) {
        console.error('Route control not available');
        return [];
    }
    
    const routes = routeControl.getRoutes();
    
    if (routes.length === 0) {
        console.error('No routes found');
        return [];
    }
    
    routes.forEach((route, routeIndex) => {
        if (route.coordinates && route.coordinates.length > 0) {
            route.coordinates.forEach((coord) => {
                routeCoordinates.push({
                    lat: coord.lat,
                    lng: coord.lng
                });
            });
        }
    });
    
    console.log(`Extracted ${routeCoordinates.length} coordinate points from route`);
    return routeCoordinates;
}

async function fetchIntermediateStops(startLat, startLng, endLat, endLng) {
    try {
        const response = await fetch(STATION_ENDPOINT_URL, {
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

        allStops = data.stops;
        return data.stops;
    } catch (error) {
        console.error('Error fetching stops:', error);
        return [];
    }
}

function clearIntermediateMarkers() {
    intermediateMarkers.forEach(marker => map.removeLayer(marker));
    intermediateMarkers = [];
}

function plotIntermediateStops(stops) {
    clearIntermediateMarkers();

    stops.forEach((stop, index) => {
        let marker;
        
        if (stop.type === 'checkpoint') {
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
            marker = L.circleMarker([stop.lat, stop.lng], {
                radius: 9,
                fillColor: '#fbbf24',
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.9
            }).bindPopup(`${stop.name}<br>City: ${stop.city}, ${stop.state}<br>Station ID: ${stop.id}`);
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

    if (routeControl) {
        map.removeControl(routeControl);
    }

    clearIntermediateMarkers();

    const stops = await fetchIntermediateStops(
        startLocation.lat,
        startLocation.lng,
        endLocation.lat,
        endLocation.lng,
        5
    );

    if (stops.length > 0) {
        plotIntermediateStops(stops);
    }

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

    getRouteMileage();

    const bounds = L.latLngBounds(
        [startLocation.lat, startLocation.lng],
        [endLocation.lat, endLocation.lng]
    );
    map.fitBounds(bounds, { padding: [50, 50] });

    window.startLocation = {
        name: startLocation.name,
        lat: startLocation.lat,
        lng: startLocation.lng
    };

    window.endLocation = {
        name: endLocation.name,
        lat: endLocation.lat,
        lng: endLocation.lng
    };
}

document.getElementById('end-location').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchRoute(event);
    }
});

function getRouteMileage() {
    if (!routeControl) {
        console.error('No route available');
        return null;
    }
    
    routeControl.on('routesfound', function(e) {
        const routes = e.routes;
        if (routes.length > 0) {
            const distanceInMeters = routes[0].summary.totalDistance;
            const distanceInMiles = Math.round((distanceInMeters * 0.000621371).toFixed(2));
            localStorage.setItem('mileage', distanceInMiles);
            const messageDiv = document.getElementById('message');
            messageDiv.innerHTML = `<div class="message success">Route displayed! Distance: ${distanceInMiles} miles</div>`;
        }
    });
}

// STATION TABLE LOGIC BELOW
const tripStops = [];

function addStop() {
    const input = document.getElementById('stop-city-input');
    const id = input.value.trim();

    if (!id) {
        alert('Please enter a station ID');
        return;
    }

    console.log(id);
    const station = allStops.find(stop => stop.id == id);
    if (station && tripStops.includes(station) === false) {
        tripStops.push(station);
        input.value = '';
        renderStops();
        input.focus();
    }
    else {
        alert('Station ID not found or already added!');
    }
}

function renderStops() {
    const tbody = document.getElementById('stops-tbody');
    tbody.innerHTML = '';
    
    tripStops.forEach((station, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="stop-number">${index + 1}</td>
            <td class="stop-name">${station.name}</td>
            <td class="stop-location">${station.city}, ${station.state}</td>
            <td class="stop-actions"><button onclick="removeStop(${index})" class="remove-btn">Remove</button></td>
        `;
        tbody.appendChild(row);
    });
}

function removeStop(index) {
    tripStops.splice(index, 1);
    renderStops();
}

document.getElementById('stop-city-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addStop();
    }
});

// CAR DROPDOWN LOGIC BELOW
async function fetchCars() {
    try {
        const response = await fetch(CAR_ENDPOINT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: user
            })
        });

        const data = await response.json();
        
        if (!data.success) {
            console.error('Error from Flask:', data.error);
            return [];
        }

        return Array.isArray(data.cars) ? data.cars : data;
    } catch (error) {
        console.error('Error fetching stops:', error);
        return [];
    }
}

let selectedCar = null;

async function initializeCars() {
    const select = document.getElementById('car-select');
    select.innerHTML = '<option value="">Select a car...</option>';

    cars = await fetchCars();
    
    cars.forEach(car => {
        const option = document.createElement('option');
        option.value = typeof car === 'string' ? car : car.name;
        option.textContent = typeof car === 'string' ? car : car.name;
        select.appendChild(option);
    });
}

async function saveCar() {
    const select = document.getElementById('car-select');
    const selectedValue = select.value;
    const carRangeDiv = document.getElementById('car-range');

    if (!selectedValue) {
        carRangeDiv.innerHTML = '<div class="message success">Please select a car</div>';
        return;
    }

    let mileage = localStorage.getItem('mileage');
    let suggestedNumStops = 'N/A';
    cars = await fetchCars();
    selectedCar = selectedValue;
    let carRange = Math.round((cars.find(car => {if (car.name == selectedCar) return car}).range)*0.621371);

    if (mileage) {
        if (mileage <= carRange) {
            suggestedNumStops = 0;
        }
        else {
            suggestedNumStops = Math.ceil(mileage / carRange) + 1;
        }
    }
    else {
        suggestedNumStops = 'Please enter a route to calculate stops';
    }
    carRangeDiv.innerHTML = `<div class="message success">Mileage range on a full charge: ${carRange} miles<br>
        Suggested number of stops: ${suggestedNumStops}</div>`;
}

window.addEventListener('load', () => {
    initializeCars();
});

// SEND TRIP DATA TO BACKEND
async function createTrip() {
    if (tripStops.length === 0) {
        alert('Please add at least one stop to your trip');
        return;
    }

    if (!selectedCar) {
        alert('Please select a car before creating a trip');
        return;
    }

    if (!startLocation || !endLocation) {
        alert('Please search for a route with start and end locations first');
        return;
    }

    let startLocationDetails = document.getElementById('start-location').value.trim().toUpperCase();
    let endLocationDetails = document.getElementById('end-location').value.trim().toUpperCase();
    let tripName = document.getElementById('trip-name').value.trim().toUpperCase();

    if (!tripName) {
        alert('Please enter a name for your trip');
        return;
    }

    const tripData = {
        name: tripName,
        start_location: {
            name: startLocation.name,
            lat: startLocation.lat,
            lng: startLocation.lng,
            location: startLocationDetails
        },
        end_location: {
            name: endLocation.name,
            lat: endLocation.lat,
            lng: endLocation.lng,
            location: endLocationDetails
        },
        stops: tripStops.map((stop, index) => ({
            order: index + 1,
            id: stop.id,
            name: stop.name,
            city: stop.city,
            state: stop.state,
            lat: stop.lat,
            lng: stop.lng,
            type: stop.type
        })),
        car: selectedCar,
        total_stops: tripStops.length,
        created_at: new Date().toISOString(),
        userId: user
    };

    try {
        const response = await fetch(TRIP_ENDPOINT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tripData)
        });

        const result = await response.json();

        if (!result.success) {
            alert('Error creating trip: ' + result.error);
            return;
        }
        
        // Reset trip data
        tripStops.length = 0;
        selectedCar = null;
        document.getElementById('start-location').value = '';
        document.getElementById('end-location').value = '';
        document.getElementById('car-select').value = '';
        document.getElementById('trip-name').value = '';
        renderStops();
        window.location.href = 'trips.html';
    } catch (error) {
        console.error('Error creating trip:', error);
        alert('Error creating trip: ' + error.message);
    }
}

function goBack() {
    window.location.href = 'trips.html';
}

window.onload = function() {
    this.localStorage.removeItem('mileage');
};