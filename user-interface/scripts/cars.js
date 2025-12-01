// Get DOM elements
const myTripsBtn = document.getElementById('myTripsBtn');
const addBtn = document.getElementById('addBtn');
const carSearch = document.getElementById('carSearch');
const carsTable = document.getElementById('carsTable');
const carsTableBody = document.getElementById('carsTableBody');

const API_BASE_URL = 'http://localhost:5000/api';
let cars = [];

// Load cars from backend
async function loadCarsFromBackend() {
    try {
        const response = await fetch(`${API_BASE_URL}/get-cars`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        if (data.success) {
            cars = data.cars;
            console.log('Cars loaded from backend:', cars);
            renderCarsTable();
            populateCarSearch();
        } else {
            console.error('Failed to load cars:', data.error);
            alert('Error loading cars: ' + data.error);
        }
    } catch (error) {
        console.error('Network error while loading cars:', error);
        alert('Error connecting to server. Please try again.');
    }
}

// Render cars in the table
function renderCarsTable() {
    carsTableBody.innerHTML = '';
    
    if (cars.length === 0) {
        return;
    }
    
    cars.forEach((car, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${car.name || car.carName || 'Unknown Car'}</td>
        `;
        
        row.addEventListener('click', function() {
            const carName = row.cells[1].textContent;
            console.log('Clicked on:', carName);
            // Add logic to view/edit car details
        });
        
        carsTableBody.appendChild(row);
    });
}

// Populate car search dropdown
function populateCarSearch() {
    cars.forEach(car => {
        const option = document.createElement('option');
        option.value = car.id || car.carId || '';
        option.textContent = car.name || car.carName || 'Unknown Car';
        carSearch.appendChild(option);
    });
}

// Navigation to My Trips
myTripsBtn.addEventListener('click', function() {
    console.log('Navigate to My Trips page');
    window.location.href = 'trips.html';
});

// Add button click handler
addBtn.addEventListener('click', function() {
    console.log('Add new car');
    // Add logic to add a new car to the table
    // Could open a modal or navigate to an add car page
});

// Car search filter
carSearch.addEventListener('change', function() {
    const selectedCarId = carSearch.value;
    console.log('Selected car ID:', selectedCarId);
    
    if (selectedCarId === '') {
        renderCarsTable();
    } else {
        const filteredCars = cars.filter(car => (car.id || car.carId) == selectedCarId);
        carsTableBody.innerHTML = '';
        
        filteredCars.forEach((car, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${car.name || car.carName || 'Unknown Car'}</td>
            `;
            
            row.addEventListener('click', function() {
                const carName = row.cells[1].textContent;
                console.log('Clicked on:', carName);
            });
            
            carsTableBody.appendChild(row);
        });
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCarsFromBackend();
});