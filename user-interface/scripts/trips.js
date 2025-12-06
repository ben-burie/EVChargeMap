let trips = [];
const API_BASE_URL = 'http://localhost:5000/api';

const user = JSON.parse(sessionStorage.getItem('user'));

if (!user) {
    alert('You must be logged in');
    window.location.href = '/logon.html';
}

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
            <td>${trip.name}</td>
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


async function viewTrip(tripId) {
    console.log(`Viewing trip ${tripId}`);
    
    try {
        const response = await fetch(`${API_BASE_URL}/get-trip-details`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tripId: tripId
            })
        });

        const data = await response.json();

        if (!data.success) {
            console.error('Failed to load trip details:', data.error);
            alert('Error loading trip details: ' + data.error);
            return;
        }

        const trip = data.trip;

        document.getElementById("modalTitle").textContent = `Trip Details`;
        document.getElementById("modalCar").textContent = `Selected car: ${trip.carName || 'N/A'}`;

        const tableBody = document.getElementById("stopsTableBody");
        tableBody.innerHTML = ""; 

        if (trip.stops && trip.stops.length > 0) {
            trip.stops.forEach(stop => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${stop.stopNumber}</td>
                    <td>${stop.stationName}</td>
                    <td>${stop.city}</td>
                    <td>${stop.state}</td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            const row = document.createElement("tr");
            row.innerHTML = `<td colspan="4">No stops found for this trip</td>`;
            tableBody.appendChild(row);
        }

        document.getElementById("tripModalOverlay").classList.add("active");

    } catch (error) {
        console.error('Network error while loading trip details:', error);
        alert('Error connecting to server. Please try again.');
    }
}

function closeModal() {
    document.getElementById("tripModalOverlay").classList.remove("active");
}

document.getElementById("tripModalOverlay").addEventListener("click", function(e) {
    if (e.target === this) {
        closeModal();
    }
});


async function loadTripsFromBackend() {
    try {
        const response = await fetch(`${API_BASE_URL}/get-trips`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID: user
            })
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