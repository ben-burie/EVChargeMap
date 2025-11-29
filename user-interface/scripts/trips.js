// Sample trips data structure (empty initially)
let trips = [];

// Function to render trips table
function renderTrips() {
    const tableBody = document.getElementById('tripsTableBody');
    tableBody.innerHTML = '';

    if (trips.length === 0) {
        // Show empty state or just leave table empty
        return;
    }

    trips.forEach(trip => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${trip.id}</td>
            <td>${trip.startLocation}</td>
            <td>${trip.endLocation}</td>
        `;
        
        // Add click handler to view/edit trip
        row.addEventListener('click', () => {
            viewTrip(trip.id);
        });
        
        tableBody.appendChild(row);
    });
}

// Function to add a new trip (modular)
function addTrip(tripData) {
    trips.push({
        id: tripData.id,
        startLocation: tripData.startLocation,
        endLocation: tripData.endLocation
    });
    renderTrips();
}

// Function to view/edit a specific trip
function viewTrip(tripId) {
    console.log(`Viewing trip ${tripId}`);
    // Navigate to trip detail/edit page
    // window.location.href = `trip-detail.html?id=${tripId}`;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Render initial trips (empty)
    renderTrips();

    // Create New Trip button
    document.getElementById('createNewTripBtn').addEventListener('click', () => {
        console.log('Create new trip clicked');
        // Navigate to create trip page
        // window.location.href = 'create-trip.html';
    });

    // My Cars button
    document.getElementById('myCarsBtn').addEventListener('click', () => {
        console.log('My Cars clicked');
        // Navigate to cars page
        // window.location.href = 'cars.html';
    });

    // Log Out button
    document.getElementById('logOutBtn').addEventListener('click', () => {
        console.log('Log out clicked');
        // Handle logout logic
        // window.location.href = 'index.html';
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