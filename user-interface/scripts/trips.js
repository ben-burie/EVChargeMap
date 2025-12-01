let trips = [];
const API_BASE_URL = 'http://localhost:5000/api';

function renderTrips() {
    const tableBody = document.getElementById('tripsTableBody');
    tableBody.innerHTML = '';

    if (trips.length === 0) {
        return;
    }

    trips.forEach(trip => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${trip.id}</td>
            <td>${trip.startLocation}</td>
            <td>${trip.endLocation}</td>
        `;
        
        row.addEventListener('click', () => {
            viewTrip(trip.id);
        });
        
        tableBody.appendChild(row);
    });
}

function addTrip(tripData) {
    trips.push({
        id: tripData.id,
        startLocation: tripData.startLocation,
        endLocation: tripData.endLocation
    });
    renderTrips();
}

function viewTrip(tripId) {
    console.log(`Viewing trip ${tripId}`);
    // Navigate to trip detail/edit page
    // window.location.href = `trip-detail.html?id=${tripId}`;
}

async function loadTripsFromBackend() {
    try {
        const response = await fetch(`${API_BASE_URL}/get-trips`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        if (data.success) {
            trips = data.trips;
            console.log('Trips loaded from backend:', trips);
            renderTrips();
        } else {
            console.error('Failed to load trips:', data.error);
            alert('Error loading trips: ' + data.error);
        }
    } catch (error) {
        console.error('Network error while loading trips:', error);
        alert('Error connecting to server. Please try again.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadTripsFromBackend();
    renderTrips();

    document.getElementById('createNewTripBtn').addEventListener('click', () => {
        console.log('Create new trip clicked');
        window.location.href = 'tripStop.html';
    });

    document.getElementById('myCarsBtn').addEventListener('click', () => {
        console.log('My Cars clicked');
        window.location.href = 'cars.html';
    });

    document.getElementById('logOutBtn').addEventListener('click', () => {
        console.log('Log out clicked');
        window.location.href = 'logon.html';
    });
});

function openTripStop() {
    window.location.href = 'tripStop.html';
}

// Example of how to add trips programmatically (for future use)
// addTrip({
//     id: '43521',
//     startLocation: 'Seattle, WA',
//     endLocation: 'Miami, FL'
// });